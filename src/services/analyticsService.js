import {
  addDoc,
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where
} from 'firebase/firestore';
import { db } from '../firebase';

const SESSION_STORAGE_KEY = 'auspik_analytics_session';

const getSessionId = () => {
  const existingId = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (existingId) return existingId;

  const sessionId = typeof window.crypto?.randomUUID === 'function'
    ? window.crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  window.sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  return sessionId;
};

export const recordPageView = async (path) => {
  await addDoc(collection(db, 'analyticsPageViews'), {
    path: path.slice(0, 200),
    createdAt: serverTimestamp()
  });
};

export const startVisitorPresence = (currentPath) => {
  const sessionId = getSessionId();
  const visitorRef = doc(db, 'analyticsActiveSessions', sessionId);

  const heartbeat = async () => {
    await setDoc(visitorRef, {
      path: currentPath.current.slice(0, 200),
      lastSeen: serverTimestamp()
    }, { merge: true });
  };

  heartbeat().catch((error) => console.error('Unable to update visitor presence:', error));
  const intervalId = window.setInterval(() => {
    heartbeat().catch((error) => console.error('Unable to update visitor presence:', error));
  }, 30000);

  return () => window.clearInterval(intervalId);
};

export const subscribeToAnalytics = (onData, onError) => {
  const activeSessionsQuery = query(
    collection(db, 'analyticsActiveSessions'),
    where('lastSeen', '>=', Timestamp.fromMillis(Date.now() - 120000))
  );
  const pageViewsQuery = query(
    collection(db, 'analyticsPageViews'),
    orderBy('createdAt', 'desc'),
    limit(500)
  );
  let activeSessions = [];
  let pageViews = [];

  const publish = () => onData({ activeSessions, pageViews });

  const unsubscribeSessions = onSnapshot(activeSessionsQuery, (snapshot) => {
    activeSessions = snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
    publish();
  }, onError);
  const unsubscribePageViews = onSnapshot(pageViewsQuery, (snapshot) => {
    pageViews = snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
    publish();
  }, onError);

  return () => {
    unsubscribeSessions();
    unsubscribePageViews();
  };
};
