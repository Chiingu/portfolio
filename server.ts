import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const cleanSingleLineText = (value: unknown) => {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().replace(/[\r\n]+/g, " ");
};

const cleanMultilineText = (value: unknown) => {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().replace(/\r/g, "");
};

const escapeHtml = (value: string) => {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT ?? 3000);

  app.use(express.json({ limit: "32kb" }));

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/send-email", async (req, res) => {
    try {
      const name = cleanSingleLineText(req.body?.name).slice(0, 80);
      const email = cleanSingleLineText(req.body?.email).slice(0, 160).toLowerCase();
      const message = cleanMultilineText(req.body?.message).slice(0, 3000);
      
      if (!name || !email || !message) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      if (!EMAIL_PATTERN.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      if (message.length < 8) {
        return res.status(400).json({ error: "Message is too short" });
      }

      const nodemailer = await import("nodemailer");
      
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn("SMTP credentials not configured. Simulating email send.");
        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return res.json({ success: true, message: "Email simulated (configure SMTP_USER and SMTP_PASS to send real emails)" });
      }

      const smtpPort = Number(process.env.SMTP_PORT ?? 587);

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number.isFinite(smtpPort) ? smtpPort : 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        replyTo: `"${name}" <${email}>`,
        to: process.env.SMTP_USER, // Send to yourself
        subject: `Portfolio Contact from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p>
               <p><strong>Email:</strong> ${escapeHtml(email)}</p>
               <p><strong>Message:</strong></p>
               <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
      });

      res.json({ success: true, message: "Email sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
