import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export type UserProfile = {
  name: string;
  bio: string;
  birth: string;
  photo: string | null;
  email?: string;
};

export async function salvarPerfilFirestore(uid: string, dados: UserProfile): Promise<void> {
  const userRef = doc(db, 'usuarios', uid);
  
  await setDoc(userRef, {
    ...dados,
    atualizadoEm: serverTimestamp()
  }, { merge: true });
}

export async function buscarPerfilFirestore(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, 'usuarios', uid);
  const snap = await getDoc(userRef);
  
  if (snap.exists()) {
    return snap.data() as UserProfile;
  }
  return null;
}