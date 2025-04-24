import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface StaffMember {
    name: string;
    position: string;
    email: string;
    phone: string;
    imageUrl: string;
}

interface StaffContextType {
    staffMembers: StaffMember[];
    addStaffMember: (staff: StaffMember) => void;
    updateStaffMember: (index: number, staff: StaffMember) => void;
    deleteStaffMember: (index: number) => void;
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
    initialStaff: StaffMember[];
}

export const StaffProvider: React.FC<StaffProviderProps> = ({ children, initialStaff }) => {
    // Initialize state from localStorage or use initialStaff
    const [staffMembers, setStaffMembers] = useState<StaffMember[]>(() => {
        const savedStaff = localStorage.getItem(STAFF_STORAGE_KEY);
        return savedStaff ? JSON.parse(savedStaff) : initialStaff;
    });

    // Save to localStorage whenever staffMembers changes
    useEffect(() => {
        localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(staffMembers));
    }, [staffMembers]);

    const addStaffMember = (staff: StaffMember) => {
        setStaffMembers(prev => [...prev, staff]);
    };

    const updateStaffMember = (index: number, staff: StaffMember) => {
        setStaffMembers(prev => prev.map((s, i) => i === index ? staff : s));
    };

    const deleteStaffMember = (index: number) => {
        setStaffMembers(prev => prev.filter((_, i) => i !== index));
    };

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