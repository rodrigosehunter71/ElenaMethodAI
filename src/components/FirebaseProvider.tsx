import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, getDocFromServer, setDoc, query, collection, where, getDocs, serverTimestamp, onSnapshot, updateDoc, deleteField } from 'firebase/firestore';
import { auth, db, FirebaseUser as UserType } from '../firebase';

interface AuthContextType {
  user: FirebaseUser | null;
  userData: any | null;
  loading: boolean;
  isAdmin: boolean;
  updateProfile: (data: any) => Promise<void>;
  setRole: (role: 'student' | 'teacher', joinCode?: string) => Promise<void>;
  resetRole: () => Promise<void>;
  addXP: (amount: number) => Promise<void>;
  handleDailyStreak: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  isAdmin: false,
  updateProfile: async () => {},
  setRole: async () => {},
  resetRole: async () => {},
  addXP: async () => {},
  handleDailyStreak: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration or network status.");
        }
      }
    };
    testConnection();

    let unsubscribeUser: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      // Cleanup previous listener if user changes
      if (unsubscribeUser) {
        unsubscribeUser();
        unsubscribeUser = null;
      }

      if (firebaseUser) {
        // Monitor the user document in real-time
        const userRef = doc(db, 'users', firebaseUser.uid);
        unsubscribeUser = onSnapshot(userRef, (snapshot) => {
          if (snapshot.exists()) {
            setUserData(snapshot.data());
          } else {
            setUserData({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              role: null,
              xp: 0,
              streak: 0,
            });
          }
          setLoading(false);
        }, (error) => {
          console.error("User data subscription error:", error);
          setLoading(false);
        });
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUser) unsubscribeUser();
    };
  }, []);

  const setRole = useCallback(async (role: 'student' | 'teacher', joinCode?: string) => {
    if (!user) return;
    setLoading(true);
    
    const finalRole = role; // No longer forcing garciahellen872 as only admin
    console.log("[FirebaseProvider] Initiating Role Sync:", finalRole);

    let classroomId = null;
    if (joinCode && finalRole === 'student') {
      try {
        const q = query(collection(db, 'classrooms'), where('joinCode', '==', joinCode.toUpperCase()));
        const snap = await getDocs(q);
        if (!snap.empty) {
          classroomId = snap.docs[0].id;
        } else {
          setLoading(false);
          throw new Error("Código de aula no válido.");
        }
      } catch (err: any) {
        console.error("[FirebaseProvider] Classroom lookup failed:", err);
        setLoading(false);
        throw err;
      }
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      const updateData: any = {
        role: finalRole,
        updatedAt: serverTimestamp()
      };
      if (classroomId) updateData.classroomId = classroomId;
      
      await setDoc(userRef, updateData, { merge: true });
      console.log("[FirebaseProvider] Role updated in Firestore to:", finalRole);
      
      // Force a local update to prevent race conditions if onSnapshot is slow
      setUserData(prev => ({ ...prev, ...updateData, role: finalRole }));
      setLoading(false);
    } catch (err: any) {
      console.error("[FirebaseProvider] Role sync failure:", err);
      setLoading(false);
      throw err;
    }
  }, [user]);

  const updateProfile = useCallback(async (data: any) => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, data, { merge: true });
    } catch (err) {
      console.error("Profile sync error:", err);
      throw err;
    }
  }, [user]);

  const isAdmin = useMemo(() => {
    const isTeacher = userData?.role === 'teacher';
    const isMasterEmail = user?.email === 'segahunter71@gmail.com' || user?.email === 'garciahellen872@gmail.com';
    return isTeacher || isMasterEmail;
  }, [userData, user]);

  const addXP = useCallback(async (amount: number) => {
    if (!user || !userData) return;
    try {
      const newXP = (userData.xp || 0) + amount;
      await updateProfile({ xp: newXP });
    } catch (err) {
      console.error("Error updating XP:", err);
    }
  }, [user, userData, updateProfile]);

  const handleDailyStreak = useCallback(async () => {
    if (!user || !userData) return;
    const now = new Date();
    const lastActiveDate = userData.lastActive ? new Date((userData.lastActive as any).seconds * 1000) : null;
    
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const lastDate = lastActiveDate ? new Date(lastActiveDate.getFullYear(), lastActiveDate.getMonth(), lastActiveDate.getDate()).getTime() : 0;
    
    const oneDay = 24 * 60 * 60 * 1000;
    
    let newStreak = userData.streak || 0;
    
    if (today !== lastDate) {
      if (today === lastDate + oneDay) {
        newStreak += 1;
      } else if (today > lastDate + oneDay) {
        newStreak = 1; // Streak reset but still active today
      } else if (lastDate === 0) {
        newStreak = 1;
      }
      
      await updateProfile({ 
        streak: newStreak, 
        lastActive: serverTimestamp() 
      });
    }
  }, [user, userData, updateProfile]);

  const resetRole = useCallback(async () => {
    if (!user) {
      console.warn("[FirebaseProvider] No valid session to reset role");
      return;
    }
    setLoading(true);
    console.log(`[FirebaseProvider] Attempting protocol reset for: ${user.email}`);
    try {
      const userRef = doc(db, 'users', user.uid);
      // Explicitly delete the role field to force RoleSelection
      await updateDoc(userRef, { 
        role: deleteField(),
        updatedAt: serverTimestamp()
      });
      
      // Update local state immediately to trigger UI transitions
      setUserData(prev => {
        const resetState = prev ? { ...prev, role: null } : null;
        console.log("[FirebaseProvider] Local state updated (role: null)");
        return resetState;
      });
      
      setLoading(false);
      console.log("[FirebaseProvider] Role reset confirmed.");
    } catch (err) {
      console.error("[FirebaseProvider] Persistent reset failure:", err);
      // Fallback to null setting if updateDoc is restricted
      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, { role: null }, { merge: true });
        setUserData(prev => ({ ...prev, role: null }));
        setLoading(false);
      } catch (innerErr) {
        console.error("[FirebaseProvider] Emergency reset failed:", innerErr);
        setLoading(false);
        alert("Error crítico resetando el rol. Por favor, limpia la caché o contacta a soporte.");
      }
    }
  }, [user]);

  const value = useMemo(() => ({
    user,
    userData,
    loading,
    isAdmin,
    updateProfile,
    setRole,
    resetRole,
    addXP,
    handleDailyStreak
  }), [user, userData, loading, isAdmin, updateProfile, setRole, resetRole, addXP, handleDailyStreak]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
