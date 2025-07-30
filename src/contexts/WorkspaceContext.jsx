import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { 
  collection, doc, addDoc, updateDoc, deleteDoc, getDocs, serverTimestamp, 
  query,
  where,
  setDoc
} from 'firebase/firestore';
import { db } from '../services/firebase'; // Adjust path to your Firebase config
import { useAuth } from './AuthContext';   // Assumes you're using AuthContext

const WorkspaceContext = createContext();



export const useWorkspace = () => useContext(WorkspaceContext);

export function WorkspaceProvider({ children }) {
    const { currentUser, setCurrentUser } = useAuth();
    const [workspaces, setWorkspaces] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchWorkspaces = async () => {
        setIsLoading(true);
        try {
            const q = query(collection(db, 'workspaces'), where('members', 'array-contains', currentUser.uid));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setWorkspaces(data);
        } catch (err) {
            console.error('Error fetching workspaces:', err);
        } finally {
            setIsLoading(false);
        }
    };


    const currentWorkspace = useMemo(() => 
        workspaces.find(w => w.url === currentUser?.workspaceURL),
        [workspaces, currentUser?.workspaceURL]
    );


    const createWorkspace = async ({ name, url }) => {
        if (!name || !url || !currentUser) return;
        const fullURL = `attendance-tracker/${url}`;

        setIsLoading(true);
        try {
            const newWorkspace = {
            name,
            url: fullURL,
            icon: 'default-icon',
            createdBy: currentUser.uid,
            createdAt: serverTimestamp(),
            members: [currentUser.uid],
            };

            // Add workspace document
            const docRef = await addDoc(collection(db, 'workspaces'), newWorkspace);

            // Update user's document
            const userDocRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userDocRef, {
            workspaceURL: fullURL,
            });
            fetchWorkspaces(); // Refresh workspaces

            // ✅ Instead of directly setting currentUser, let the onSnapshot do the job
            return fullURL;
        } catch (err) {
            console.error('Error creating workspace:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };


    const updateWorkspace = async (id, updates) => {
        if (!id || !updates) return;
        try {
        await updateDoc(doc(db, 'workspaces', id), updates);
        } catch (err) {
        console.error('Error updating workspace:', err);
        throw err;
        }
    };

    const deleteWorkspace = async (id) => {
        if (!id) return;
        try {
        await deleteDoc(doc(db, 'workspaces', id));
        } catch (err) {
        console.error('Error deleting workspace:', err);
        throw err;
        }
    };

    useEffect(() => {
        fetchWorkspaces();
    }, []);

    useEffect(() => {
        if (!currentUser) {
            setWorkspaces([]);
        }
    }, [currentUser]);


    return (
        <WorkspaceContext.Provider value={{
        workspaces,
        currentWorkspace,
        isLoading,
        createWorkspace,
        updateWorkspace,
        deleteWorkspace,
        fetchWorkspaces,
        }}>
        {children}
        </WorkspaceContext.Provider>
    );
}
