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
import {doc, getDoc, updateDoc, setDoc, onSnapshot} from "firebase/firestore";
import { db } from "../services/firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const signup = async (email, password, name) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      name: name || "",
      email: email,
      workspaceURL: "",
      createdAt: new Date(),
      onboardingStep: 1,
    });

    return user;
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      // If the document doesn't exist, create it
      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          name: user.displayName || "",
          email: user.email || "",
          photoURL: user.photoURL || "",
          workspaceURL: "",
          createdAt: new Date(),
          onboardingStep: 1,
        });
      }

      return user;
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    }
  };

  const logout = () => signOut(auth);

  // Update user workspaceURL
  function updateUserWorkspaceURL(workspaceURL) {
    currentUser.workspaceURL = workspaceURL;
    if (currentUser) {
      const userDocRef = doc(db, "users", currentUser.uid);
      updateDoc(userDocRef, { workspaceURL });
    }
  }
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);

        // 👇 Listen to real-time changes on the user's document
        const unsubscribeSnapshot = onSnapshot(userDocRef, async (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              ...userData,
            });
          } else {
            // If doc doesn't exist, create it
            const userData = {
              email: user.email,
              name: "",
              workspaceURL: "",
              createdAt: new Date(),
            };
            await setDoc(userDocRef, userData);

            setCurrentUser({
              uid: user.uid,
              ...userData,
            });
          }

          setLoading(false);
        });

        // 👇 Clean up Firestore listener when auth state changes
        return () => unsubscribeSnapshot();
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
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
