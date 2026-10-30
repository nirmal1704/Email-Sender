import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { emailConfig, getEmailHtml, getEmailSubject } from '../../../config/email.config';
import fs from 'fs';
import path from 'path';

const resend = new Resend(process.env.RESEND_API_KEY);
const DAILY_LIMIT = 100;
const BATCH_SIZE = 10;
const RATE_LIMIT_DELAY_MS = 1000;
const STATS_FILE = path.join(process.cwd(), 'stats.json');

export async function POST(request) {
  try {
    const { users } = await request.json();

    if (!users || !Array.isArray(users)) {
      return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 });
    }

    const today = new Date().toDateString();
    let currentSent = 0;
    
    if (fs.existsSync(STATS_FILE)) {
      const fileData = JSON.parse(fs.readFileSync(STATS_FILE, 'utf-8'));
      if (fileData.date === today) {
        currentSent = fileData.sent;
      }
    }

    if (currentSent >= DAILY_LIMIT) {
      return NextResponse.json({ error: 'Daily limit reached.' }, { status: 429 });
    }

    const remainingAllowed = DAILY_LIMIT - currentSent;
    const usersToProcess = users.slice(0, remainingAllowed);
    let sentCount = 0;

    // Load attachments if they exist
    const attachments = [];
    
    // Check for rules document
    const rulesPaths = [
      path.join(process.cwd(), 'public', 'rules-and-regulations.docx'),
      path.join(process.cwd(), 'public', 'rules-and-regulations.pdf')
    ];
    for (const p of rulesPaths) {
      if (fs.existsSync(p)) {
        attachments.push({
          filename: 'Rules_and_Regulations' + path.extname(p),
          content: fs.readFileSync(p)
        });
        break; // Only attach one rules doc
      }
    }

    // Check for poster to attach as a downloadable file
    const posterPaths = [
      path.join(process.cwd(), 'public', 'hacklabs-poster.jpg'),
      path.join(process.cwd(), 'public', 'hacklabs-poster.jpeg'),
      path.join(process.cwd(), 'public', 'hacklabs-poster.png')
    ];
    for (const p of posterPaths) {
      if (fs.existsSync(p)) {
        attachments.push({
          filename: 'HackLabs_2026_Poster' + path.extname(p),
          content: fs.readFileSync(p)
        });
        break; // Only attach one poster
      }
    }

    for (let i = 0; i < usersToProcess.length; i += BATCH_SIZE) {
      const batch = usersToProcess.slice(i, i + BATCH_SIZE);

      const promises = batch.map((user) => {
        const emailAddress = user._targetEmail || user.Email || user['Email Address'];
        if (!emailAddress) return Promise.resolve(null);

        return resend.emails.send({
          from: emailConfig.from,
          to: emailAddress,
          subject: getEmailSubject(user),
          html: getEmailHtml(user),
          attachments: attachments.length > 0 ? attachments : undefined
        });
      });

      const results = await Promise.all(promises);
      sentCount += results.filter(r => r && !r.error).length;

      // Update stats immediately after batch
      fs.writeFileSync(STATS_FILE, JSON.stringify({ date: today, sent: currentSent + sentCount }));

      if (i + BATCH_SIZE < usersToProcess.length) {
        await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_DELAY_MS));
      }
    }

    return NextResponse.json({
      success: true,
      sentCount,
      message: users.length > remainingAllowed ? `Capped due to daily limit.` : 'All emails sent.'
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
