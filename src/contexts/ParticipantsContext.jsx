    import React, { createContext, useContext, useState, useEffect } from 'react';
    import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    setDoc,
    query,
    where,
    writeBatch,
    } from 'firebase/firestore';
    import { db } from '../services/firebase';
    import { useAuth } from './AuthContext';
    import { useWorkspace } from './WorkspaceContext';
    import { useProfiles } from './ProfilesContext';
    import * as XLSX from 'xlsx';

    const ParticipantsContext = createContext();

    export const useParticipants = () => useContext(ParticipantsContext);

    export function ParticipantsProvider({ children }) {
    const { currentUser } = useAuth();

    const [participants, setParticipants] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const { profiles, fetchProfiles } = useProfiles();

        const fetchParticipants = async (workspaceID,eventId) => {
            if (!eventId || !workspaceID) return;
            setIsLoading(true);
            try {
            const participantsRef = collection(
                db,
                'workspaces',
                workspaceID,
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

        const addParticipant = async (workspaceID, eventId, participantId, participantData) => {
            if (!eventId || !participantId || !participantData || !workspaceID) return;

            try {
                const participantRef = doc(
                db,
                'workspaces',
                workspaceID,
                'events',
                eventId,
                'participants',
                participantId // ✅ Use same ID as profile
                );

                await setDoc(participantRef, participantData);
                await fetchParticipants(eventId);
                return participantRef.id;
            } catch (err) {
                console.error('Error adding participant:', err);
                throw err;
            }
        };


        const updateParticipant = async (workspaceID, eventId, participantId, updates) => {
            if (!eventId || !participantId || !updates || !workspaceID) return;

            try {
            const participantRef = doc(
                db,
                'workspaces',
                workspaceID,
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

        const removeParticipant = async (workspaceID, eventId, participantId) => {
            if (!eventId || !participantId || !workspaceID) return;

            try {
            const participantRef = doc(
                db,
                'workspaces',
                workspaceID,
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

        const findProfileByIDNumber = async (workspaceID, idNumber) => {
            if (!idNumber || !workspaceID) return null;

            try {
                const profilesRef = collection(db, 'workspaces', workspaceID, 'profiles');
                const q = query(profilesRef, where('IDNumber', '==', idNumber.trim()));
                const snapshot = await getDocs(q);

                if (!snapshot.empty) {
                const docSnap = snapshot.docs[0];
                return { id: docSnap.id, ...docSnap.data() };
                }

                return null;
            } catch (error) {
                console.error('Error checking profile by ID number:', error);
                return null;
            }
        };

        const importParticipantsFromExcel = async (workspaceID ,file, eventId) => {
            if (!file || !eventId || !workspaceID) return;

            try {
                const reader = new FileReader();

                reader.onload = async (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

                // Refresh latest profiles and participants
                await fetchProfiles();
                await fetchParticipants(eventId);

                const existingProfileIDs = new Set(profiles.map((p) => p.IDNumber?.trim()));
                const existingParticipantIDs = new Set(participants.map((p) => p.IDNumber?.trim()));

                const profilesRef = collection(
                    db,
                    "workspaces",
                    workspaceID,
                    "profiles"
                );

                const participantsRef = collection(
                    db,
                    "workspaces",
                    workspaceID,
                    "events",
                    eventId,
                    "participants"
                );

                const batchPromises = jsonData
                    .filter(
                    (row) => row["Student ID"] && row["First Name"] && row["Last Name"]
                    )
                    .map(async (row) => {
                    const IDNumber = (row["Student ID"] || "").trim();

                    // ✅ Skip if participant already exists for this event
                    if (existingParticipantIDs.has(IDNumber)) {
                        console.warn(`Skipped participant already registered: ${IDNumber}`);
                        return null;
                    }

                    const profileData = {
                        IDNumber,
                        firstName: row["First Name"] || "",
                        lastName: row["Last Name"] || "",
                        middleName: row["Middle Name"] || "",
                        email: row["Email"] || "",
                        phone: row["Phone"] || "",
                        collegeDepartment: row["College Department"] || "",
                        course: row["Course"] || "",
                        yearLevel: row["Year Level"] || "",
                        section: row["Section"] || "",
                    };

                    let profileId;

                    if (existingProfileIDs.has(IDNumber)) {
                        // Use existing profile
                        const matched = profiles.find(
                        (p) => p.IDNumber?.trim() === IDNumber
                        );
                        profileId = matched?.id;
                    } else {
                        // Create new profile
                        const newDocRef = await addDoc(profilesRef, profileData);
                        profileId = newDocRef.id;
                        existingProfileIDs.add(IDNumber);
                    }

                    const participantData = {
                        ...profileData,
                        status: "registered",
                    };

                    // Use profileId as participant ID
                    const participantDocRef = doc(participantsRef, profileId);
                    await setDoc(participantDocRef, participantData);
                    });

                await Promise.all(batchPromises);
                await fetchParticipants(eventId);
                };

                reader.readAsArrayBuffer(file);
            } catch (err) {
                console.error("Error importing participants from Excel:", err);
                throw err;
            }
        };

        const updateParticipantStatus = async (workspaceID, eventId, participantId, status) => {
            if (!eventId || !participantId || !status || !workspaceID) return;

            try {
                const participantRef = doc(
                    db,
                    'workspaces',
                    workspaceID,
                    'events',
                    eventId,
                    'participants',
                    participantId
                );

                await updateDoc(participantRef, { status });
                await fetchParticipants(eventId);
            } catch (err) {
                console.error('Error updating participant status:', err);
                throw err;
            }
        };


        const updateParticipantStatusByScan = async (workspaceID, eventId, participantId, status) => {
            if (!eventId || !participantId || !status || !workspaceID) return;

            try {
                const participantRef = doc(
                    db,
                    'workspaces',
                    workspaceID,
                    'events',
                    eventId,
                    'participants',
                    participantId
                );

                await updateDoc(participantRef, { status });
                await fetchParticipants(eventId);
            } catch (err) {
                console.error('Error updating participant status:', err);
                throw err;
            }
        };
        
        const clearList = async (workspaceID, eventId) => {
            if (!eventId) return;
        
            try {
                const participantsCollectionRef = collection(
                db,
                "workspaces",
                workspaceID,
                "events",
                eventId,
                "participants"
                );
        
                const snapshot = await getDocs(participantsCollectionRef);
                const batch = writeBatch(db);
        
                snapshot.forEach((doc) => {
                batch.delete(doc.ref);
                });
        
                await batch.commit();
                await fetchParticipants(eventId);
            } catch (err) {
                console.error("Error removing participants:", err);
                throw err;
            }
        };
        
        const resetList = async (workspaceID, eventId) => {
            if (!eventId) return;
        
            try {
                const participantsCollectionRef = collection(
                db,
                "workspaces",
                workspaceID,
                "events",
                eventId,
                "participants"
                );
        
                const snapshot = await getDocs(participantsCollectionRef);
                const batch = writeBatch(db);
        
                snapshot.forEach((doc) => {
                batch.update(doc.ref, { status: "registered" });
                });
        
                await batch.commit();
                await fetchParticipants(eventId);
            } catch (err) {
                console.error("Error resetting participant statuses:", err);
                throw err;
            }
        };

        const getParticipantsByEvent = async (workspaceID, eventID) => {
            try {
                const participantsRef = collection(
                db,
                "workspaces",
                workspaceID,
                "events",
                eventID,
                "participants"
                );

                const snapshot = await getDocs(participantsRef);

                const participants = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
                }));

                return participants;
            } catch (error) {
                console.error("Error fetching participants:", error);
                return [];
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
                findProfileByIDNumber,
                importParticipantsFromExcel,
                updateParticipantStatus,
                updateParticipantStatusByScan,
                clearList,
                resetList,
                getParticipantsByEvent
            }}
            >
            {children}
            </ParticipantsContext.Provider>
        );
    }
