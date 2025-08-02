import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Doctor } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Fetch doctor data from Firestore
        try {
          const doctorDoc = await getDoc(doc(db, 'doctors', user.uid));
          if (doctorDoc.exists()) {
            setDoctor(doctorDoc.data() as Doctor);
          }
        } catch (error) {
          console.error('Error fetching doctor data:', error);
        }
      } else {
        setDoctor(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, doctor, loading };
};