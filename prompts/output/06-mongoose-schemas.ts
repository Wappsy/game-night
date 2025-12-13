// Mongoose Schemas (outline)
import { Schema } from 'mongoose';

export const SessionSchema = new Schema({
  code: { type: String, required: true, unique: true, index: true },
  status: { type: String, enum: ['lobby', 'in_progress', 'ended'], default: 'lobby' },
  hostId: { type: String },
  category: { type: String, required: true },
  roundConfig: { questions: { type: Number, default: 10 }, timerSec: { type: Number, default: 20 } },
}, { timestamps: true });

export const TeamSchema = new Schema({
  sessionId: { type: Schema.Types.ObjectId, ref: 'Session', index: true },
  name: { type: String, required: true },
  emblem: { type: String },
  score: { type: Number, default: 0 }
}, { timestamps: true });

export const PlayerSchema = new Schema({
  sessionId: { type: Schema.Types.ObjectId, ref: 'Session', index: true },
  teamId: { type: Schema.Types.ObjectId, ref: 'Team' },
  displayName: { type: String, required: true },
  isHost: { type: Boolean, default: false },
  joinedAt: { type: Date, default: Date.now },
  disconnectedAt: { type: Date }
});

export const QuestionSchema = new Schema({
  category: { type: String, required: true, index: true },
  topic: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], index: true },
  prompt: { type: String, required: true },
  choices: { type: [String], validate: v => Array.isArray(v) && v.length === 4 },
  correctIndex: { type: Number, min: 0, max: 3, required: true },
  source: { type: String },
  media: { image: { type: String }, audio: { type: String } }
}, { timestamps: true });

export const AnswerSchema = new Schema({
  sessionId: { type: Schema.Types.ObjectId, ref: 'Session', index: true },
  questionId: { type: Schema.Types.ObjectId, ref: 'Question' },
  playerId: { type: Schema.Types.ObjectId, ref: 'Player' },
  teamId: { type: Schema.Types.ObjectId, ref: 'Team' },
  isCorrect: { type: Boolean, required: true },
  responseIndex: { type: Number, min: 0, max: 3 },
  timeMs: { type: Number },
}, { timestamps: true });
