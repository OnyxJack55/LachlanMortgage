import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import * as staffService from '../services/staffService';

export interface StaffMember {
    id?: string; // Firestore document ID
    name: string;
    position: string;
    email: string;
    phone: string;
    imageUrl: string;
}

interface StaffContextType {
    staffMembers: StaffMember[];
    addStaffMember: (staff: Omit<StaffMember, 'id'>) => Promise<void>;
    updateStaffMember: (id: string, staff: Omit<StaffMember, 'id'>) => Promise<void>;
    deleteStaffMember: (id: string, imageUrl?: string) => Promise<void>;
}

const STAFF_STORAGE_KEY = 'lachlanmortgage_staff';

const StaffContext = createContext<StaffContextType | undefined>(undefined);

export const useStaff = () => {
    const context = useContext(StaffContext);
    if (!context) {
        throw new Error('useStaff must be used within a StaffProvider');
    }
    return context;
};

interface StaffProviderProps {
    children: ReactNode;
    initialStaff?: StaffMember[]; // Not used with Firestore
}

export const StaffProvider: React.FC<StaffProviderProps> = ({ children }) => {
    const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);

    // Subscribe to Firestore staff collection for real-time updates
    useEffect(() => {
        const unsubscribe = staffService.subscribeToStaff((staff) => {
            setStaffMembers(staff as StaffMember[]);
        });
        return () => unsubscribe();
    }, []);

    const addStaffMember = useCallback(async (staff: Omit<StaffMember, 'id'>) => {
        await staffService.addStaff(staff);
    }, []);

    const updateStaffMember = useCallback(async (id: string, staff: Omit<StaffMember, 'id'>) => {
        await staffService.updateStaff(id, staff);
    }, []);

    const deleteStaffMember = useCallback(async (id: string, imageUrl?: string) => {
        await staffService.deleteStaff(id, imageUrl);
    }, []);

    return (
        <StaffContext.Provider value={{
            staffMembers,
            addStaffMember,
            updateStaffMember,
            deleteStaffMember
        }}>
            {children}
        </StaffContext.Provider>
    );
};

export default StaffContext; 