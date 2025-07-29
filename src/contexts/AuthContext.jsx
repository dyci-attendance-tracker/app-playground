import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../services/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import { db } from "../services/firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const signup = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);
  const signInWithGoogle = () => signInWithPopup(auth, new GoogleAuthProvider());

  // Update user workspaceURL
  function updateUserWorkspaceURL(workspaceURL) {
    currentUser.workspaceURL = workspaceURL;
    if (currentUser) {
      const userDocRef = doc(db, "users", currentUser.uid);
      updateDoc(userDocRef, { workspaceURL });
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              ...userData,
            });
          } else {
            // fallback if no doc exists
            setCurrentUser({ uid: user.uid, email: user.email });
          }
        } catch (err) {
          console.error("Failed to fetch user document:", err);
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);


  console.log("Current User:", currentUser);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    signInWithGoogle,
    updateUserWorkspaceURL,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
