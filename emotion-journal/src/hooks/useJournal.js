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

    // const unsub = onSnapshot(q, (snap) => {
    //   setEntries(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    // });

      const unsub = onSnapshot(q, (snap) => {
      const updatedEntries = snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
    
      console.log("Snapshot updated:", updatedEntries.length);
      console.log(updatedEntries);
    
      setEntries(updatedEntries);
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

  // async function deleteEntry(id) {
  //   await deleteDoc(doc(db, 'users', userId, 'entries', id));
  // }

  async function deleteEntry(id) {
    console.log("User ID:", userId);
    console.log("Deleting document:", id);
  
    try {
      await deleteDoc(doc(db, 'users', userId, 'entries', id));
  
      // Update UI immediately
      setEntries(prev =>
        prev.filter(entry => entry.id !== id)
      );
  
      console.log("DELETE SUCCESS");
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  }

  return { entries, isAnalyzing, error, addEntry, deleteEntry };
}
