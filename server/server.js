import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const MONGO_DB = process.env.MONGO_DB || 'game-night';
const mongoReady = (async () => {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  const db = client.db(MONGO_DB);
  return db.collection('sessions');
})();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

const defaultRoundConfig = { questions: 10, timerSec: 20 };

async function persistSession(code, session) {
  try {
    const col = await mongoReady;
    const doc = {
      code,
      category: session.category,
      roundConfig: session.roundConfig,
      started: session.started,
      round: session.round,
      teamScores: session.teamScores,
      teams: Array.from(session.teams.keys()),
      players: Array.from(session.players.values()).map(p => ({ name: p.name, teamName: p.teamName })),
      current: session.current
        ? {
            question: session.current.question,
            startedAt: session.current.startedAt,
            submitted: Array.from(session.current.submitted || []),
            timerSec: session.current.timerSec
          }
        : null
    };
    await col.updateOne({ code }, { $set: doc }, { upsert: true });
  } catch (e) {
    console.error('persistSession error', e);
  }
}

async function loadSession(code) {
  try {
    const col = await mongoReady;
    const doc = await col.findOne({ code });
    if (!doc) return null;
    const session = {
      players: new Map(),
      teams: new Map(),
      teamScores: doc.teamScores || {},
      category: doc.category || '80s Pop Culture',
      roundConfig: doc.roundConfig || defaultRoundConfig,
      started: doc.started || false,
      round: doc.round || 0,
      current: doc.current
        ? {
            question: doc.current.question,
            startedAt: doc.current.startedAt,
            submitted: new Set(doc.current.submitted || []),
            timerSec: doc.current.timerSec
          }
        : null
    };
    (doc.teams || []).forEach(name => session.teams.set(name, new Set()));
    sessions.set(code, session);
    return session;
  } catch (e) {
    console.error('loadSession error', e);
    return null;
  }
}

// In-memory session store (for demo)
const sessions = new Map(); // code -> { players: Map<socketId, {name, teamName}>, teams: Map<teamName, Set<socketId>>, teamScores: {}, started: false, round: 0, roundConfig, current: { question, startedAt, submitted: Set<socketId>, timerSec } }
const currentTimers = new Map();

let io; // assigned after server creation

function finalizeQuestion(code, session) {
  if (!session.current) return;
  io.to(code).emit('question_end', { correctIndex: session.current.question.correctIndex });
  session.current = null;
  persistSession(code, session);
  if (currentTimers.has(code)) {
    clearTimeout(currentTimers.get(code));
    currentTimers.delete(code);
  }
}

function scheduleQuestionEnd(code, session) {
  if (!session?.current) return;
  if (currentTimers.has(code)) {
    clearTimeout(currentTimers.get(code));
    currentTimers.delete(code);
  }
  const startedAt = session.current.startedAt || Date.now();
  const timerMs = (session.current.timerSec ?? 20) * 1000;
  const remainingMs = timerMs - (Date.now() - startedAt);
  if (remainingMs <= 0) {
    finalizeQuestion(code, session);
    return;
  }
  const id = setTimeout(() => finalizeQuestion(code, session), remainingMs);
  currentTimers.set(code, id);
}

app.post('/api/sessions', async (req, res) => {
  const { category = '80s Pop Culture', roundConfig = defaultRoundConfig } = req.body || {};
  const code = generateCode();
  const session = { players: new Map(), teams: new Map(), teamScores: {}, category, roundConfig, started: false, round: 0 };
  sessions.set(code, session);
  await persistSession(code, session);
  res.json({ code });
});

app.post('/api/sessions/:code/join', async (req, res) => {
  const { code } = req.params;
  if (!sessions.has(code)) {
    const loaded = await loadSession(code);
    if (!loaded) return res.status(404).json({ error: 'Session not found' });
  }
  // Client will connect via WS; REST join acknowledges existence
  res.json({ ok: true });
});

app.get('/api/sessions/:code/state', async (req, res) => {
  const { code } = req.params;
  let session = sessions.get(code);
  if (!session) {
    session = await loadSession(code);
  }
  if (!session) return res.status(404).json({ error: 'Session not found' });
  if (session.current) scheduleQuestionEnd(code, session);
  let current = null;
  if (session.current) {
    const startedAt = session.current.startedAt || Date.now();
    const timerMs = (session.current.timerSec ?? 20) * 1000;
    const remainingSec = Math.max(0, Math.ceil((timerMs - (Date.now() - startedAt)) / 1000));
    current = {
      prompt: session.current.question.prompt,
      choices: session.current.question.choices,
      remainingSec,
      timerSec: session.current.timerSec,
      round: session.round
    };
  }
  res.json({
    code,
    players: Array.from(session.players.values()),
    teamScores: session.teamScores,
    teams: Array.from(session.teams.entries()).map(([name, ids]) => ({ name, players: ids.size })),
    started: session.started,
    current
  });
});

app.post('/api/sessions/:code/start', async (req, res) => {
  const { code } = req.params;
  let session = sessions.get(code) || await loadSession(code);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  session.started = true;
  session.round = 1;
  // Load a random question from dataset
  const dataPath = path.join(process.cwd(), '..', 'data', '80s-pop-culture.json');
  let question = null;
  try {
    const raw = fs.readFileSync(dataPath, 'utf-8');
    const json = JSON.parse(raw);
    const list = json.questions || [];
    if (list.length > 0) {
      const q = list[Math.floor(Math.random() * list.length)];
      question = { prompt: q.prompt, choices: q.choices, correctIndex: q.correctIndex };
    }
  } catch (e) {
    // noop
  }
  if (question) {
    const timerSec = (session.roundConfig?.timerSec ?? 20);
    session.current = { question, startedAt: Date.now(), submitted: new Set(), timerSec };
    io.to(code).emit('round_start', { round: session.round });
    io.to(code).emit('question_start', { prompt: question.prompt, choices: question.choices, timerSec, round: session.round });
    scheduleQuestionEnd(code, session);
  }
  await persistSession(code, session);
  res.json({ ok: true });
});

app.post('/api/sessions/:code/round/next', async (req, res) => {
  const { code } = req.params;
  let session = sessions.get(code) || await loadSession(code);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  // Advance round, end game if exceeded configured questions
  session.round = (session.round || 0) + 1;
  const totalRounds = session.roundConfig?.questions ?? 10;
  if (session.round > totalRounds) {
    io.to(code).emit('game_end', { finalScores: session.teamScores, totalRounds });
    session.started = false;
    session.current = null;
    await persistSession(code, session);
    return res.json({ ok: true, ended: true });
  }
  const dataPath = path.join(process.cwd(), '..', 'data', '80s-pop-culture.json');
  let question = null;
  try {
    const raw = fs.readFileSync(dataPath, 'utf-8');
    const json = JSON.parse(raw);
    const list = json.questions || [];
    if (list.length > 0) {
      const q = list[Math.floor(Math.random() * list.length)];
      question = { prompt: q.prompt, choices: q.choices, correctIndex: q.correctIndex };
    }
  } catch (e) {}
  if (question) {
    const timerSec = (session.roundConfig?.timerSec ?? 20);
    session.current = { question, startedAt: Date.now(), submitted: new Set(), timerSec };
    io.to(code).emit('round_start', { round: session.round });
    io.to(code).emit('question_start', { prompt: question.prompt, choices: question.choices, timerSec, round: session.round });
    scheduleQuestionEnd(code, session);
  }
  await persistSession(code, session);
  res.json({ ok: true });
});

app.post('/api/sessions/:code/question/end', async (req, res) => {
  const { code } = req.params;
  const session = sessions.get(code) || await loadSession(code);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  if (!session.current) return res.json({ ok: true, ended: false });
  finalizeQuestion(code, session);
  res.json({ ok: true, ended: true });
});

const httpServer = createServer(app);
io = new Server(httpServer, { cors: { origin: '*' } });

const rooms = new Map();

io.on('connection', (socket) => {
  socket.on('join', async ({ code, name, teamName }) => {
    socket.join(code);
    const room = rooms.get(code) || { players: new Set(), teamScores: {} };
    room.players.add(socket.id);
    rooms.set(code, room);
    let session = sessions.get(code) || await loadSession(code);
    if (session) {
      const playerName = name || `Player-${socket.id.slice(0,4)}`;
      const resolvedTeam = teamName || playerName; // default solo players into their own team for scoring/leaderboard
      session.players.set(socket.id, { name: playerName, teamName: resolvedTeam });
      
      // Track teams
      if (!session.teams.has(resolvedTeam)) {
        session.teams.set(resolvedTeam, new Set());
      }
      session.teams.get(resolvedTeam).add(socket.id);
      if (!session.teamScores[resolvedTeam]) {
        session.teamScores[resolvedTeam] = 0;
      }
    }
    
    // Emit player list and team info
    const playerList = session ? Array.from(session.players.values()) : Array.from(room.players);
    const teamList = session ? Array.from(session.teams.entries()).map(([name, ids]) => ({ name, count: ids.size })) : [];
    io.to(code).emit('presence_update', { players: playerList, teams: teamList });
    if (session) persistSession(code, session);
    if (session?.current) {
      scheduleQuestionEnd(code, session);
      if (!session.current) return; // expired during scheduling
      const startedAt = session.current.startedAt || Date.now();
      const timerMs = (session.current.timerSec ?? 20) * 1000;
      const remainingSec = Math.max(0, Math.ceil((timerMs - (Date.now() - startedAt)) / 1000));
      socket.emit('question_start', {
        prompt: session.current.question.prompt,
        choices: session.current.question.choices,
        timerSec: remainingSec,
        round: session.round
      });
    }
  });

  socket.on('disconnecting', async () => {
    for (const code of socket.rooms) {
      if (rooms.has(code)) {
        const room = rooms.get(code);
        room.players.delete(socket.id);
        const session = sessions.get(code) || await loadSession(code);
        if (session) {
          const playerInfo = session.players.get(socket.id);
          if (playerInfo?.teamName && session.teams.has(playerInfo.teamName)) {
            session.teams.get(playerInfo.teamName).delete(socket.id);
            if (session.teams.get(playerInfo.teamName).size === 0) {
              session.teams.delete(playerInfo.teamName);
              delete session.teamScores[playerInfo.teamName];
            }
          }
          session.players.delete(socket.id);
        }
        const playerList = session ? Array.from(session.players.values()) : Array.from(room.players);
        const teamList = session ? Array.from(session.teams.entries()).map(([name, ids]) => ({ name, count: ids.size })) : [];
        io.to(code).emit('presence_update', { players: playerList, teams: teamList });
        if (session) {
          io.to(code).emit('scoreboard_update', { teamScores: session.teamScores });
          persistSession(code, session);
        }
      }
    }
  });

  socket.on('name_update', async ({ code, name }) => {
    const session = sessions.get(code) || await loadSession(code);
    if (!session) return;
    const playerInfo = session.players.get(socket.id);
    if (!playerInfo) return;
    const updated = { ...playerInfo, name: name || playerInfo.name };
    session.players.set(socket.id, updated);
    const playerList = Array.from(session.players.values());
    const teamList = Array.from(session.teams.entries()).map(([tName, ids]) => ({ name: tName, count: ids.size }));
    io.to(code).emit('presence_update', { players: playerList, teams: teamList });
    persistSession(code, session);
  });

  socket.on('team_update', async ({ code, teamName }) => {
    const session = sessions.get(code) || await loadSession(code);
    if (!session || !teamName) return;
    const playerInfo = session.players.get(socket.id);
    if (!playerInfo) return;
    const oldTeam = playerInfo.teamName;
    const newTeam = teamName;

    // remove from old team
    if (oldTeam && session.teams.has(oldTeam)) {
      session.teams.get(oldTeam).delete(socket.id);
      if (session.teams.get(oldTeam).size === 0) {
        session.teams.delete(oldTeam);
        delete session.teamScores[oldTeam];
      }
    }

    // add to new team
    if (!session.teams.has(newTeam)) {
      session.teams.set(newTeam, new Set());
    }
    session.teams.get(newTeam).add(socket.id);
    if (!session.teamScores[newTeam]) {
      session.teamScores[newTeam] = 0;
    }

    // update player record
    session.players.set(socket.id, { ...playerInfo, teamName: newTeam });

    const playerList = Array.from(session.players.values());
    const teamList = Array.from(session.teams.entries()).map(([tName, ids]) => ({ name: tName, count: ids.size }));
    io.to(code).emit('presence_update', { players: playerList, teams: teamList });
    io.to(code).emit('scoreboard_update', { teamScores: session.teamScores });
    persistSession(code, session);
  });

  socket.on('answer_submit', async ({ code, index, timeMs }) => {
    const session = sessions.get(code) || await loadSession(code);
    if (!session || !session.current) return;
    const elapsedMs = Date.now() - (session.current.startedAt || Date.now());
    const timerMs = (session.current.timerSec ?? 20) * 1000;
    if (elapsedMs >= timerMs) {
      finalizeQuestion(code, session);
      return;
    }
    if (session.current.submitted.has(socket.id)) return; // one submission per player
    session.current.submitted.add(socket.id);
    const correct = session.current.question.correctIndex === index;
    const base = correct ? 100 : 0;
    const timerSec = (session.roundConfig?.timerSec ?? 20);
    const remainingSec = Math.max(0, timerSec - Math.floor((Date.now() - session.current.startedAt) / 1000));
    const bonus = correct ? Math.max(0, Math.floor(50 * (remainingSec / timerSec))) : 0;
    const points = base + bonus;
    
    const playerInfo = session.players.get(socket.id);
    if (playerInfo?.teamName) {
      // Team mode: aggregate to team score
      session.teamScores[playerInfo.teamName] = (session.teamScores[playerInfo.teamName] || 0) + points;
    }
    
    // Emit team leaderboard update
    io.to(code).emit('scoreboard_update', { teamScores: session.teamScores });
    persistSession(code, session);
  });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => console.log(`WS server running on ${PORT}`));
