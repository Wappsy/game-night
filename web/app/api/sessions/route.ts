import { NextResponse } from 'next/server';

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export async function POST() {
  const code = generateCode();
  return NextResponse.json({ code });
}
