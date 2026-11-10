/* ============================================================
   RadiEndo · DADOS DA PESQUISA
   - Sessão do participante (código individual, sem nome).
   - Registro de eventos (páginas, laboratório, atividades, tutora).
   - Armazenamento local sempre; envio ao Supabase se configurado.
   Visitantes (sem código) NÃO têm nada registrado.
   ============================================================ */
(function () {
  const CFG = window.RADIENDO_CONFIG || {};
  const KEY_SESSION = "radiendo.session";
  const KEY_EVENTS = "radiendo.events";

  function safeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function safeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function safeDel(k) { try { localStorage.removeItem(k); } catch (e) {} }

  let memEvents = [];           // fallback se o navegador bloquear localStorage
  let session = null;
  try { session = JSON.parse(safeGet(KEY_SESSION)); } catch (e) {}

  function uid() { return (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2)); }

  function readEvents() {
    try { const r = JSON.parse(safeGet(KEY_EVENTS)); if (Array.isArray(r)) return r; } catch (e) {}
    return memEvents;
  }
  function writeEvents(list) { memEvents = list; safeSet(KEY_EVENTS, JSON.stringify(list)); }

  async function sendRemote(ev) {
    if (!CFG.supabaseUrl || !CFG.supabaseKey) return;
    try {
      await fetch(CFG.supabaseUrl + "/rest/v1/events", {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: CFG.supabaseKey, Authorization: "Bearer " + CFG.supabaseKey, Prefer: "return=minimal" },
        body: JSON.stringify({ id: ev.id, participant_code: ev.code, session_id: ev.session, type: ev.type, page: ev.page, payload: ev.payload, client_ts: ev.ts, app_version: CFG.versao }),
        keepalive: true
      });
    } catch (e) { /* offline: o registro local permanece */ }
  }

  const Data = {
    getSession() { return session; },
    isParticipant() { return !!(session && session.code); },
    start(code) {
      code = String(code || "").trim().toUpperCase();
      if (!/^[A-Z0-9-]{3,20}$/.test(code)) return false;
      session = { code, sessionId: uid(), startedAt: new Date().toISOString() };
      safeSet(KEY_SESSION, JSON.stringify(session));
      Data.log("session_start", {});
      return true;
    },
    visitor() { session = null; safeDel(KEY_SESSION); },
    end() { Data.log("session_end", {}); Data.visitor(); },

    log(type, payload, page) {
      if (!Data.isParticipant()) return;
      const ev = { id: uid(), code: session.code, session: session.sessionId, type, page: page || (location.hash || "#home").slice(1), payload: payload || {}, ts: new Date().toISOString() };
      const list = readEvents(); list.push(ev); writeEvents(list);
      sendRemote(ev);
    },

    events: readEvents,
    count() { return readEvents().length; },
    clear() { writeEvents([]); },

    toJSON() { return JSON.stringify(readEvents(), null, 2); },
    toCSV() {
      const esc = v => '"' + String(v == null ? "" : v).replace(/"/g, '""') + '"';
      const rows = [["id", "codigo", "sessao", "tipo", "pagina", "data_hora", "dados"].map(esc).join(",")];
      readEvents().forEach(e => rows.push([e.id, e.code, e.session, e.type, e.page, e.ts, JSON.stringify(e.payload)].map(esc).join(",")));
      return "﻿" + rows.join("\n");
    },
    remoteEnabled() { return !!(CFG.supabaseUrl && CFG.supabaseKey); }
  };
  window.RadiData = Data;
})();
