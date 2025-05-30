import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, subscribeToAuth } from '../../services/authService';
import StaffModal from '../../components/admin/StaffModal';
import { useStaff, StaffMember } from '../../context/StaffContext';
import PageTitle from '../../components/PageTitle';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { staffMembers, addStaffMember, updateStaffMember, deleteStaffMember } = useStaff();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = subscribeToAuth((firebaseUser) => {
            setUser(firebaseUser);
        });
        return () => unsubscribe();
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | undefined>(undefined);

    const handleLogout = async () => {
        await logout();
        navigate('/admin/login');
    };

    const handleAddStaff = () => {
        setModalMode('add');
        setSelectedStaff(undefined);
        setIsModalOpen(true);
    };

    const handleEditStaff = (staff: StaffMember) => {
        setModalMode('edit');
        setSelectedStaff(staff);
        setIsModalOpen(true);
    };

    const handleDeleteStaff = async (staff: StaffMember) => {
        if (staff.id && window.confirm('Are you sure you want to delete this staff member?')) {
            await deleteStaffMember(staff.id, staff.imageUrl);
        }
    };

    const handleSaveStaff = async (staff: StaffMember) => {
        if (modalMode === 'add') {
            await addStaffMember({ ...staff });
        } else if (modalMode === 'edit' && selectedStaff && selectedStaff.id) {
            await updateStaffMember(selectedStaff.id, { ...staff });
        }
        setIsModalOpen(false);
    };

    return (
        <>
            <PageTitle title="Admin Dashboard - Lachlan Mortgage" />
            <div className="min-h-screen bg-gray-100">
                <nav className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-600">Welcome, {user?.email}</span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </nav>
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Staff Management</h2>
                            <button
                                onClick={handleAddStaff}
                                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Add Staff Member
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Staff Member
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Position
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Contact
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {staffMembers.map((staff) => (
                                        <tr key={staff.id || staff.email}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0">
                                                        <img className="h-10 w-10 rounded-full object-cover" src={staff.imageUrl} alt="" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{staff.position}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{staff.email}</div>
                                                <div className="text-sm text-gray-500">{staff.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleEditStaff(staff)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteStaff(staff)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
            <StaffModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveStaff}
                staff={selectedStaff}
                mode={modalMode}
            />
        </>
    );
};

export default Dashboard; 