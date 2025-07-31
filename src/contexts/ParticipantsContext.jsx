import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';
import { useWorkspace } from './WorkspaceContext';

const ParticipantsContext = createContext();

export const useParticipants = () => useContext(ParticipantsContext);

export function ParticipantsProvider({ children }) {
  const { currentUser } = useAuth();
  const { currentWorkspace } = useWorkspace();

  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchParticipants = async (eventId) => {
    if (!eventId || !currentWorkspace?.id) return;
    setIsLoading(true);
    try {
      const participantsRef = collection(
        db,
        'workspaces',
        currentWorkspace.id,
        'events',
        eventId,
        'participants'
      );
      const snapshot = await getDocs(participantsRef);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setParticipants(data);
    } catch (err) {
      console.error('Error fetching participants:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addParticipant = async (eventId, participantData) => {
    if (!eventId || !participantData || !currentWorkspace?.id) return;

    try {
      const participantsRef = collection(
        db,
        'workspaces',
        currentWorkspace.id,
        'events',
        eventId,
        'participants'
      );
      const docRef = await addDoc(participantsRef, participantData);
      await fetchParticipants(eventId);
      return docRef.id;
    } catch (err) {
      console.error('Error adding participant:', err);
      throw err;
    }
  };

  const updateParticipant = async (eventId, participantId, updates) => {
    if (!eventId || !participantId || !updates || !currentWorkspace?.id) return;

    try {
      const participantRef = doc(
        db,
        'workspaces',
        currentWorkspace.id,
        'events',
        eventId,
        'participants',
        participantId
      );
      await updateDoc(participantRef, updates);
      await fetchParticipants(eventId);
    } catch (err) {
      console.error('Error updating participant:', err);
      throw err;
    }
  };

  const removeParticipant = async (eventId, participantId) => {
    if (!eventId || !participantId || !currentWorkspace?.id) return;

    try {
      const participantRef = doc(
        db,
        'workspaces',
        currentWorkspace.id,
        'events',
        eventId,
        'participants',
        participantId
      );
      await deleteDoc(participantRef);
      await fetchParticipants(eventId);
    } catch (err) {
      console.error('Error removing participant:', err);
      throw err;
    }
  };

  return (
    <ParticipantsContext.Provider
      value={{
        participants,
        isLoading,
        fetchParticipants,
        addParticipant,
        updateParticipant,
        removeParticipant,
      }}
    >
      {children}
    </ParticipantsContext.Provider>
  );
}
