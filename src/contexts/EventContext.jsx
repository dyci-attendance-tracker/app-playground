import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';

const EventContext = createContext();

export const useEvents = () => useContext(EventContext);

export function EventProvider({ children }) {
  const { currentUser } = useAuth();

  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEvents = async (workspaceID) => {
    if (!currentUser || !workspaceID) return;
    setIsLoading(true);
    try {
      const eventsRef = collection(db, 'workspaces', workspaceID, 'events');
      const snapshot = await getDocs(eventsRef);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEventById = async (eventId, workspaceID) => {
    if (!eventId || !workspaceID) {
      console.warn("Missing eventId or workspaceID", { eventId, workspaceID });
      return null;
    }

    setIsLoading(true);
    try {
      console.log(`Fetching event at: workspaces/${workspaceID}/events/${eventId}`);

      const eventDocRef = doc(db, 'workspaces', workspaceID, 'events', eventId);
      const docSnap = await getDoc(eventDocRef);

      if (docSnap.exists()) {
        const eventData = { id: docSnap.id, ...docSnap.data() };
        console.log("Fetched Event Data:", eventData);
        return eventData;
      } else {
        console.warn('No event found with this ID.');
        return null;
      }
    } catch (err) {
      console.error('Error fetching event by ID:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };


  const createEvent = async (workspaceID, eventData) => {
    if (!eventData || !currentUser || !workspaceID) return;

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
      const eventsRef = collection(db, 'workspaces', workspaceID, 'events');
      const docRef = await addDoc(eventsRef, newEvent);
      await fetchEvents(workspaceID);
      return docRef.id;
    } catch (err) {
      console.error('Error creating event:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateEvent = async (workspaceID, id, updates) => {
    if (!id || !updates || !workspaceID) return;
    try {
      const eventRef = doc(db, 'workspaces', workspaceID, 'events', id);
      await updateDoc(eventRef, updates);
      await fetchEvents(workspaceID);
    } catch (err) {
      console.error('Error updating event:', err);
      throw err;
    }
  };

  const deleteEvent = async (workspaceID, id) => {
    if (!id || !workspaceID) return;
    try {
      const eventRef = doc(db, 'workspaces', workspaceID, 'events', id);
      await deleteDoc(eventRef);
      await fetchEvents(workspaceID);
    } catch (err) {
      console.error('Error deleting event:', err);
      throw err;
    }
  };

  const duplicateEvent = async (workspaceID, event) => {
    if (!event || !currentUser || !workspaceID) return;

    const duplicatedEvent = {
        name: `${event.name} (Copy)`,
        summary: event.summary || '',
        description: event.description || '',
        date: event.date || '',
    };

    try {
        await createEvent(workspaceID,duplicatedEvent);
    } catch (err) {
        console.error('Error duplicating event:', err);
        throw err;
    }
  };

  return (
    <EventContext.Provider
      value={{
        events,
        isLoading,
        fetchEvents,
        fetchEventById,
        createEvent,
        updateEvent,
        duplicateEvent,
        deleteEvent
      }}
    >
      {children}
    </EventContext.Provider>
  );
}
