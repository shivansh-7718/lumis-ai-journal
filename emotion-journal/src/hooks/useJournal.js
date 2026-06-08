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

  useEffect(() => {
    if (!userId) { setEntries([]); return; }

    const q = query(
      collection(db, 'users', userId, 'entries'),
      orderBy('date', 'desc')
    );

    const unsub = onSnapshot(q, (snap) => {
      setEntries(snap.docs.map(d => ({ ...d.data(), id: d.id })));
    }, (err) => {
      console.error('Firestore error:', err.code, err.message);
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
    try {
      await deleteDoc(doc(db, 'users', userId, 'entries', id));
    } catch (err) {
      console.error('Delete error:', err.code, err.message);
      setError('Could not delete entry: ' + err.message);
    }
    
  }
  async function deleteEntry(id) {
    try {
      console.log('attempting delete:', `users/${userId}/entries/${id}`);
      const ref = doc(db, 'users', userId, 'entries', id);
      console.log('ref path:', ref.path);
      await deleteDoc(ref);
      console.log('delete done');
    } catch (err) {
      console.error('Delete error:', err.code, err.message);
    }
  }

  return { entries, isAnalyzing, error, addEntry, deleteEntry };
}
