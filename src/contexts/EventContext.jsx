import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';
import { useWorkspace } from './WorkspaceContext';

const EventContext = createContext();

export const useEvents = () => useContext(EventContext);

export function EventProvider({ children }) {
  const { currentUser } = useAuth();
  const { currentWorkspace } = useWorkspace();

  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEvents = async () => {
    if (!currentUser || !currentWorkspace?.id) return;
    setIsLoading(true);
    try {
      const eventsRef = collection(db, 'workspaces', currentWorkspace.id, 'events');
      const snapshot = await getDocs(eventsRef);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createEvent = async (eventData) => {
    if (!eventData || !currentUser || !currentWorkspace?.id) return;

    const newEvent = {
      ...eventData,
      createdBy: {
        uid: currentUser.uid,
        name: currentUser.name || '',
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    setIsLoading(true);
    try {
      const eventsRef = collection(db, 'workspaces', currentWorkspace.id, 'events');
      const docRef = await addDoc(eventsRef, newEvent);
      await fetchEvents();
      return docRef.id;
    } catch (err) {
      console.error('Error creating event:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateEvent = async (id, updates) => {
    if (!id || !updates || !currentWorkspace?.id) return;
    try {
      const eventRef = doc(db, 'workspaces', currentWorkspace.id, 'events', id);
      await updateDoc(eventRef, updates);
      await fetchEvents();
    } catch (err) {
      console.error('Error updating event:', err);
      throw err;
    }
  };

  const deleteEvent = async (id) => {
    if (!id || !currentWorkspace?.id) return;
    try {
      const eventRef = doc(db, 'workspaces', currentWorkspace.id, 'events', id);
      await deleteDoc(eventRef);
      await fetchEvents();
    } catch (err) {
      console.error('Error deleting event:', err);
      throw err;
    }
  };

  const duplicateEvent = async (event) => {
    if (!event || !currentUser || !currentWorkspace?.id) return;

    const duplicatedEvent = {
        name: `${event.name} (Copy)`,
        summary: event.summary || '',
        description: event.description || '',
        date: event.date || '',
    };

    try {
        await createEvent(duplicatedEvent);
    } catch (err) {
        console.error('Error duplicating event:', err);
        throw err;
    }
};


  useEffect(() => {
    fetchEvents();
    console.log('Events fetched:', events);
  }, [currentUser, currentWorkspace?.id]);

  return (
    <EventContext.Provider
      value={{
        events,
        isLoading,
        fetchEvents,
        createEvent,
        updateEvent,
        duplicateEvent,
        deleteEvent,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}
