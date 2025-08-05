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
import * as XLSX from 'xlsx';


const ProfilesContext = createContext();

export const useProfiles = () => useContext(ProfilesContext);

export function ProfilesProvider({ children }) {
  const { currentUser } = useAuth();
  const { currentWorkspace } = useWorkspace();

  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProfiles = async () => {
    if (!currentWorkspace?.id) return;
    setIsLoading(true);
    try {
      const profilesRef = collection(
        db,
        'workspaces',
        currentWorkspace.id,
        'profiles'
      );
      const snapshot = await getDocs(profilesRef);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProfiles(data);
    } catch (err) {
      console.error('Error fetching profiles:', err);
    } finally {
      setIsLoading(false);
    }
  };

    const createProfile = async (profileData) => {
        if (!profileData || !currentWorkspace?.id) return;

        // Check for duplicate
        const duplicate = profiles.find(
            (p) => p.IDNumber?.trim() === profileData.IDNumber?.trim()
        );
        if (duplicate) {
            throw new Error(`Student number ${profileData.IDNumber} already exists.`);
        }

        try {
            const profilesRef = collection(
            db,
            'workspaces',
            currentWorkspace.id,
            'profiles'
            );
            const docRef = await addDoc(profilesRef, profileData);
            await fetchProfiles();
            return docRef.id;
        } catch (err) {
            console.error('Error adding profile:', err);
            throw err;
        }
    };


  const updateProfile = async (profileId, updates) => {
    if (!profileId || !updates || !currentWorkspace?.id) return;
    try {
      const profileRef = doc(
        db,
        'workspaces',
        currentWorkspace.id,
        'profiles',
        profileId
      );
      await updateDoc(profileRef, updates);
      await fetchProfiles();
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  const deleteProfile = async (profileId) => {
    if (!profileId || !currentWorkspace?.id) return;
    try {
      const profileRef = doc(
        db,
        'workspaces',
        currentWorkspace.id,
        'profiles',
        profileId
      );
      await deleteDoc(profileRef);
      await fetchProfiles();
    } catch (err) {
      console.error('Error removing profile:', err);
      throw err;
    }
  };

    const importProfilesFromExcel = async (file) => {
        if (!file || !currentWorkspace?.id) return;
        try {
            const reader = new FileReader();

            reader.onload = async (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '' });

            // Refresh current profiles to ensure up-to-date checks
            await fetchProfiles();

            const existingIDs = new Set(profiles.map((p) => p.IDNumber?.trim()));

            const profilesRef = collection(
                db,
                'workspaces',
                currentWorkspace.id,
                'profiles'
            );

            const batchPromises = jsonData
                .filter((row) => row["Student Number"] && row["First Name"] && row["Last Name"])
                .map(async (row) => {
                const IDNumber = (row["Student Number"] || '').trim();

                // Skip if already exists
                if (existingIDs.has(IDNumber)) {
                    console.warn(`Skipped duplicate: ${IDNumber}`);
                    return null;
                }

                const profileData = {
                    IDNumber,
                    firstName: row["First Name"] || '',
                    lastName: row["Last Name"] || '',
                    middleName: row["Middle Name"] || '',
                    email: row["Email"] || '',
                    phone: row["Phone"] || '',
                    collegeDepartment: row["College Department"] || '',
                    course: row["Course"] || '',
                    yearLevel: row["Year Level"] || '',
                    section: row["Section"] || '',
                };

                existingIDs.add(IDNumber); // prevent double-entry from file itself
                return addDoc(profilesRef, profileData);
                });

            await Promise.all(batchPromises);
            await fetchProfiles();
            };

            reader.readAsArrayBuffer(file);
        } catch (err) {
            console.error('Error importing profiles from Excel:', err);
            throw err;
        }
    };


  return (
    <ProfilesContext.Provider
      value={{
        profiles,
        isLoading,
        fetchProfiles,
        createProfile,
        updateProfile,
        deleteProfile,
        importProfilesFromExcel
      }}
    >
      {children}
    </ProfilesContext.Provider>
  );
}
