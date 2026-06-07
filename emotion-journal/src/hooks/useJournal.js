import { useState, useEffect } from 'react';
import {
  collection, addDoc, deleteDoc,
  doc, onSnapshot, query, orderBy
} from 'firebase/firestore';
import { db } from '../firebase';
import { analyzeEmotion } from '../utils/analyzeEmotion';
import { createEntry } from '../utils/createEntry';

export function useJournal(userId) {
  const [entries, setEntries] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  // realtime listener — updates entries whenever Firestore changes
  useEffect(() => {
    if (!userId) { setEntries([]); return; }

    const q = query(
      collection(db, 'users', userId, 'entries'),
      orderBy('date', 'desc')
    );

    const unsub = onSnapshot(q, (snap) => {
      setEntries(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return unsub;
  }, [userId]);

  async function addEntry(text) {
    setIsAnalyzing(true);
    setError(null);
    try {
      const analysis = await analyzeEmotion(text);
      const entry = createEntry(text, analysis);
      await addDoc(collection(db, 'users', userId, 'entries'), entry);
      return entry;
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function deleteEntry(id) {
    await deleteDoc(doc(db, 'users', userId, 'entries', id));
  }

  return { entries, isAnalyzing, error, addEntry, deleteEntry };
}