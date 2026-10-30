import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const STATS_FILE = path.join(process.cwd(), 'stats.json');

export async function GET() {
  try {
    const today = new Date().toDateString();
    let stats = { date: today, sent: 0 };

    if (fs.existsSync(STATS_FILE)) {
      const fileData = JSON.parse(fs.readFileSync(STATS_FILE, 'utf-8'));
      if (fileData.date === today) {
        stats = fileData;
      } else {
        // New day, reset
        fs.writeFileSync(STATS_FILE, JSON.stringify(stats));
      }
    } else {
      fs.writeFileSync(STATS_FILE, JSON.stringify(stats));
    }

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
