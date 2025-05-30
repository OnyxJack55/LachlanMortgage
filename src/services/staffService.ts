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
import { storage } from '../firebase';
import { ref as storageRef, deleteObject } from 'firebase/storage';

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

export const deleteStaff = async (id: string, imageUrl?: string) => {
  // Delete Firestore document
  await deleteDoc(doc(db, STAFF_COLLECTION, id));
  // Delete image from Firebase Storage if it exists and is a Firebase Storage URL
  if (imageUrl && imageUrl.includes('firebasestorage.googleapis.com')) {
    try {
      // Extract the path after '/o/' and before '?' (Firebase Storage URL format)
      const match = imageUrl.match(/\/o\/(.*?)\?/);
      if (match && match[1]) {
        const filePath = decodeURIComponent(match[1]);
        await deleteObject(storageRef(storage, filePath));
      }
    } catch (err) {
      // Log error but don't block deletion
      console.error('Failed to delete staff image from storage:', err);
    }
  }
};

// Real-time listener
export const subscribeToStaff = (callback: (staff: DocumentData[]) => void) => {
  return onSnapshot(collection(db, STAFF_COLLECTION), (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
}; 