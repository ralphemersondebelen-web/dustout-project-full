// server/index.js - Express backend for DustOut bookings
import express from "express";
import cors from "cors";
import { google } from "googleapis";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "DustOut server running" });
});

// Google OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

// Create calendar event
async function createCalendarEvent({ summary, description, startDateTime, endDateTime, attendees = [] }) {
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });
  const event = {
    summary,
    description,
    start: { dateTime: startDateTime },
    end: { dateTime: endDateTime },
    attendees: attendees.map((email) => ({ email })),
    reminders: { useDefault: true },
  };

  try {
    const res = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
      resource: event,
      sendUpdates: "all",
    });
    return res.data;
  } catch (err) {
    console.error("Google Calendar error:", err.message);
    throw new Error("Failed to create calendar event");
  }
}

// Send confirmation email
async function sendConfirmationEmail({ to, subject, text, html }) {
  try {
    const accessTokenObj = await oauth2Client.getAccessToken();
    const accessToken = accessTokenObj?.token;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_ADDRESS,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken,
      },
    });

    return transporter.sendMail({
      from: `DustOut Inc <${process.env.EMAIL_ADDRESS}>`,
      to,
      subject,
      text,
      html,
    });
  } catch (err) {
    console.error("Email error:", err.message);
    throw new Error("Failed to send confirmation email");
  }
}

// Booking route
app.post("/api/book", async (req, res) => {
  try {
    const { service, date, time, email } = req.body;
    if (!service || !date || !time || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 🧪 Short-circuit if TEST_MODE is true
    if (process.env.TEST_MODE === "true") {
      const fakeEvent = {
        id: "test-event-123",
        summary: `DustOut: ${service}`,
        start: { dateTime: `${date}T${time}` },
        end: { dateTime: new Date(new Date(`${date}T${time}`).getTime() + 60 * 60 * 1000).toISOString() },
        htmlLink: "http://localhost:5173/fake-event"
      };

      console.log("🧪 TEST_MODE enabled — skipping Google Calendar + Email.");
      return res.json({ ok: true, event: fakeEvent });
    }

    // 🚀 Real booking flow
    const startDateTime = new Date(`${date}T${time}`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

    const event = await createCalendarEvent({
      summary: `DustOut: ${service}`,
      description: `Booking for ${service} by ${email}`,
      startDateTime: startDateTime.toISOString(),
      endDateTime: endDateTime.toISOString(),
      attendees: [email],
    });

    const subject = `DustOut Booking Confirmed — ${service} on ${date} at ${time}`;
    const text = `Your booking for ${service} is confirmed. Event link: ${event.htmlLink || "—"}`;

    await sendConfirmationEmail({
      to: email,
      subject,
      text,
      html: `<p>${text}</p>`,
    });

    res.json({ ok: true, event });
  } catch (err) {
    console.error("Booking error", err);
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Booking server running on http://localhost:${PORT}`);
});
