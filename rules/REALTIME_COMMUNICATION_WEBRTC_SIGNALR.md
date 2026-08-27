# 📡 Real-Time Communication & WebRTC Architecture

*Enterprise standards for real-time bi-directional video, audio, chat, and telemetry using WebRTC, SignalR, and WebSockets.*

---

## 1. Technology Selection Matrix

| Protocol / Tool | Best For | Typical Latency | Examples |
|---|---|---|---|
| **WebRTC (Twilio / Zoom / LiveKit)** | Peer-to-peer 1-on-1 and Group Video/Audio calls | $<200\text{ms}$ (Ultra-low) | Telehealth, video consultations, live streaming |
| **Microsoft SignalR / Socket.io** | Bi-directional state sync, chat, live status | $<500\text{ms}$ | Live price tickers, chat rooms, notifications |
| **Server-Sent Events (SSE)** | Unidirectional backend-to-client streaming | $<500\text{ms}$ | AI token streaming (Gemini/ChatGPT responses) |

---

## 2. SignalR Hub Connection Lifecycle Pattern

Always encapsulate real-time socket connections inside a resilient singleton service with automatic reconnection:

```typescript
import * as signalR from '@microsoft/signalr';
import { logger } from '../utils/logger';

export class SignalRService {
  private hubConnection: signalR.HubConnection | null = null;

  public async connect(hubUrl: string, token: string): Promise<void> {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => token,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.hubConnection.onreconnecting(error => {
      logger.warn('[SignalR] Reconnecting to hub...', { error });
    });

    this.hubConnection.onreconnected(connectionId => {
      logger.info(`[SignalR] Reconnected successfully. New connectionId: ${connectionId}`);
    });

    try {
      await this.hubConnection.start();
      logger.info('[SignalR] Connected successfully.');
    } catch (err) {
      logger.error('[SignalR] Initial connection failed:', err);
    }
  }

  public subscribe<T>(eventName: string, callback: (data: T) => void): () => void {
    if (!this.hubConnection) throw new Error('SignalR is not connected');

    this.hubConnection.on(eventName, callback);
    return () => this.hubConnection?.off(eventName, callback);
  }

  public disconnect(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
      this.hubConnection = null;
    }
  }
}
```

---

## 3. WebRTC Video Session Best Practices
1. **Device Permission Verification**: Pre-check camera and microphone permissions before mounting video components.
2. **Audio Mode & Proximity Sensor**: In React Native, ensure audio session routes to earpiece vs speaker based on proximity sensor state.
3. **Network Jitter Buffering**: Handle low-bandwidth fallbacks by gracefully disabling remote video tracks to preserve voice quality.
