import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly key = 'pc_parts_session_id';

  getSessionId(): string {
    const existing = localStorage.getItem(this.key);
    if (existing) {
      return existing;
    }

    const sessionId = `web-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(this.key, sessionId);
    return sessionId;
  }
}
