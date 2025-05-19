import { db } from '../firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  DocumentData
} from 'firebase/firestore';

const STAFF_COLLECTION = 'staff';

export const getStaff = async () => {
  const snapshot = await getDocs(collection(db, STAFF_COLLECTION));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addStaff = async (staff: any) => {
  return await addDoc(collection(db, STAFF_COLLECTION), staff);
};

export const updateStaff = async (id: string, staff: any) => {
  return await updateDoc(doc(db, STAFF_COLLECTION, id), staff);
};

export const deleteStaff = async (id: string) => {
  return await deleteDoc(doc(db, STAFF_COLLECTION, id));
};

// Real-time listener
export const subscribeToStaff = (callback: (staff: DocumentData[]) => void) => {
  return onSnapshot(collection(db, STAFF_COLLECTION), (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
}; 