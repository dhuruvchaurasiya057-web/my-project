import express from "express";
import { createServer as createViteServer } from "vite";
import net from "net";
import { exec } from "child_process";
import os from "os";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Ping Check
  app.get("/api/ping", (req, res) => {
    const host = (req.query.host as string) || "127.0.0.1";
    // Use -c 1 for linux/mac, -n 1 for windows
    const command = os.platform() === "win32" ? `ping -n 1 ${host}` : `ping -c 1 ${host}`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        return res.json({ host, status: "FAIL", error: error.message });
      }
      res.json({ host, status: "PASS", output: stdout });
    });
  });

  // API Route for System Diagnosis (Port Check)
  app.get("/api/diagnose-port", (req, res) => {
    const host = (req.query.host as string) || "127.0.0.1";
    const port = parseInt(req.query.port as string) || 80;

    const socket = new net.Socket();
    let status = "UNKNOWN";

    socket.setTimeout(2000);

    socket.on("connect", () => {
      status = "PASS";
      socket.destroy();
    });

    socket.on("timeout", () => {
      status = "FAIL (Timeout)";
      socket.destroy();
    });

    socket.on("error", (err) => {
      status = `FAIL (${err.message})`;
    });

    socket.on("close", () => {
      res.json({
        host,
        port,
        status,
        timestamp: new Date().toISOString()
      });
    });

    socket.connect(port, host);
  });

  // API Route for sending Slack alerts
  app.post("/api/send-alert", async (req, res) => {
    const { message, testWebhookUrl } = req.body;
    const webhookUrl = testWebhookUrl || process.env.SLACK_WEBHOOK_URL;

    if (!webhookUrl) {
      console.warn("Slack alert skipped: SLACK_WEBHOOK_URL not configured.");
      return res.status(200).json({ status: "skipped", reason: "no_webhook_url" });
    }

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: `🚨 DIAGNOSTIC ALERT: ${message}` }),
      });

      if (response.ok) {
        res.json({ status: "success" });
      } else {
        const errorText = await response.text();
        res.status(500).json({ status: "error", message: errorText });
      }
    } catch (error: any) {
      console.error("Failed to send Slack alert:", error);
      res.status(500).json({ status: "error", message: error.message });
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
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
