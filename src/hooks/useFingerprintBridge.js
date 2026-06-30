import { useEffect, useRef, useState, useCallback } from 'react';

const BRIDGE_URL = 'ws://localhost:8091';

export function useFingerprintBridge() {
  const wsRef        = useRef(null);
  const handlersRef  = useRef({});
  const pendingRef   = useRef([]);  // messages reçus avant l'enregistrement des handlers

  const [status,  setStatus]  = useState('disconnected');
  const [message, setMessage] = useState('');

  const dispatch = useCallback((msg) => {
    const handler = handlersRef.current[msg.type];
    if (handler) {
      handler(msg);
    } else {
      // Stocker pour replay quand le handler sera enregistré
      pendingRef.current.push(msg);
    }
  }, []);

  const connect = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState < 2) return;
    setStatus('connecting');
    setMessage('');
    pendingRef.current = [];

    const ws = new WebSocket(BRIDGE_URL);
    wsRef.current = ws;

    ws.onopen  = () => setStatus('open');
    ws.onerror = () => {
      setStatus('error');
      setMessage('Pont biométrique inaccessible (ws://localhost:8091). Lancez : node fp-bridge.js');
    };
    ws.onclose = () => setStatus('disconnected');
    ws.onmessage = ({ data }) => {
      let msg;
      try { msg = JSON.parse(data); } catch { return; }
      // 'ready' → mise à jour du statut interne + dispatch
      if (msg.type === 'ready') setStatus('ready');
      dispatch(msg);
    };
  }, [dispatch]);

  useEffect(() => {
    connect();
    return () => { wsRef.current?.close(); };
  }, [connect]);

  const on = useCallback((type, handler) => {
    handlersRef.current[type] = handler;
    // Rejouer les messages en attente pour ce type
    const pending = pendingRef.current.filter(m => m.type === type);
    if (pending.length > 0) {
      pendingRef.current = pendingRef.current.filter(m => m.type !== type);
      pending.forEach(m => handler(m));
    }
  }, []);

  const send = useCallback((obj) => {
    if (wsRef.current?.readyState === 1) wsRef.current.send(JSON.stringify(obj));
  }, []);

  return { status, message, setStatus, setMessage, on, send, connect };
}
