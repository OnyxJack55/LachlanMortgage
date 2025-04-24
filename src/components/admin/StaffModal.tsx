import React, { useState, useEffect } from 'react';

interface StaffMember {
    name: string;
    position: string;
    email: string;
    phone: string;
    imageUrl: string;
}

interface FormErrors {
    name?: string;
    position?: string;
    email?: string;
    phone?: string;
    imageUrl?: string;
}

const POSITIONS = [
    'Senior Mortgage Broker',
    'Mortgage Broker',
    'Mortgage Specialist',
    'Commercial Broker',
    'Residential Specialist',
    'Finance Consultant',
    'Loan Officer',
    'Senior Loan Officer',
    'Credit Analyst',
    'Mortgage Advisor',
    'Client Service Manager',
    'Settlement Officer',
    'Other'
] as const;

interface StaffModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (staff: StaffMember) => void;
    staff?: StaffMember;
    mode: 'add' | 'edit';
}

const StaffModal: React.FC<StaffModalProps> = ({ isOpen, onClose, onSave, staff, mode }) => {
    const [formData, setFormData] = useState<StaffMember>({
        name: '',
        position: '',
        email: '',
        phone: '',
        imageUrl: ''
    });

    const [customPosition, setCustomPosition] = useState('');
    const [showCustomPosition, setShowCustomPosition] = useState(false);

    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<keyof StaffMember, boolean>>({
        name: false,
        position: false,
        email: false,
        phone: false,
        imageUrl: false
    });

    useEffect(() => {
        if (staff && mode === 'edit') {
            setFormData(staff);
            // Check if the position is in our predefined list
            if (!POSITIONS.includes(staff.position as typeof POSITIONS[number])) {
                setShowCustomPosition(true);
                setCustomPosition(staff.position);
            }
        } else {
            setFormData({
                name: '',
                position: '',
                email: '',
                phone: '',
                imageUrl: ''
            });
            setCustomPosition('');
            setShowCustomPosition(false);
        }
        // Reset errors and touched state
        setErrors({});
        setTouched({
            name: false,
            position: false,
            email: false,
            phone: false,
            imageUrl: false
        });
    }, [staff, mode]);

    const validateField = (name: keyof StaffMember, value: string): string | undefined => {
        switch (name) {
            case 'name':
                if (!value.trim()) return 'Name is required';
                if (value.length < 2) return 'Name must be at least 2 characters';
                if (value.length > 50) return 'Name must be less than 50 characters';
                return undefined;

            case 'position':
                if (!value.trim()) return 'Position is required';
                if (value.length < 2) return 'Position must be at least 2 characters';
                if (value.length > 50) return 'Position must be less than 50 characters';
                return undefined;

            case 'email':
                if (!value.trim()) return 'Email is required';
                if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                    return 'Invalid email address';
                }
                if (!value.toLowerCase().endsWith('lachlanmortgage.com') && 
                    !value.toLowerCase().endsWith('lachlanmortgage.com.au')) {
                    return 'Email must be a Lachlan Mortgage email address';
                }
                return undefined;

            case 'phone':
                if (!value.trim()) return 'Phone number is required';
                // Australian phone number format (mobile or landline)
                if (!/^(\+61|0)[2-478](?:[ -]?[0-9]){8}$/.test(value.replace(/\s/g, ''))) {
                    return 'Invalid Australian phone number format';
                }
                return undefined;

            case 'imageUrl':
                if (!value.trim()) return 'Image URL is required';
                try {
                    new URL(value);
                    if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(value)) {
                        return 'URL must point to an image file (jpg, jpeg, png, gif, webp)';
                    }
                } catch {
                    return 'Invalid URL format';
                }
                return undefined;

            default:
                return undefined;
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === 'position') {
            if (value === 'Other') {
                setShowCustomPosition(true);
                setFormData(prev => ({ ...prev, [name]: customPosition }));
            } else {
                setShowCustomPosition(false);
                setFormData(prev => ({ ...prev, [name]: value }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        
        // Validate field if it's been touched
        if (touched[name as keyof StaffMember]) {
            const error = validateField(name as keyof StaffMember, value);
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    const handleCustomPositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setCustomPosition(value);
        setFormData(prev => ({ ...prev, position: value }));
        
        if (touched.position) {
            const error = validateField('position', value);
            setErrors(prev => ({ ...prev, position: error }));
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        const error = validateField(name as keyof StaffMember, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all fields
        const newErrors: FormErrors = {};
        let hasErrors = false;

        (Object.keys(formData) as Array<keyof StaffMember>).forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) {
                newErrors[field] = error;
                hasErrors = true;
            }
        });

        setErrors(newErrors);
        setTouched({
            name: true,
            position: true,
            email: true,
            phone: true,
            imageUrl: true
        });

        if (!hasErrors) {
            onSave(formData);
        }
    };

    if (!isOpen) return null;

    const getInputClassName = (fieldName: keyof StaffMember) => {
        const baseClasses = "mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
        return `${baseClasses} ${
            errors[fieldName] && touched[fieldName]
                ? "border-red-300"
                : "border-gray-300"
        }`;
    };

    // Find the current position in the list or set to 'Other'
    const currentPosition = POSITIONS.includes(formData.position as typeof POSITIONS[number]) 
        ? formData.position 
        : 'Other';

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-[32rem] shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                        {mode === 'add' ? 'Add New Staff Member' : 'Edit Staff Member'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={getInputClassName('name')}
                                required
                            />
                            {errors.name && touched.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                                Position
                            </label>
                            <select
                                id="position"
                                name="position"
                                value={currentPosition}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={getInputClassName('position')}
                                required
                            >
                                <option value="">Select a position</option>
                                {POSITIONS.map((pos) => (
                                    <option key={pos} value={pos}>{pos}</option>
                                ))}
                            </select>
                            {showCustomPosition && (
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        id="customPosition"
                                        value={customPosition}
                                        onChange={handleCustomPositionChange}
                                        onBlur={handleBlur}
                                        placeholder="Enter custom position"
                                        className={getInputClassName('position')}
                                        required
                                    />
                                </div>
                            )}
                            {errors.position && touched.position && (
                                <p className="mt-1 text-sm text-red-600">{errors.position}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={getInputClassName('email')}
                                required
                            />
                            {errors.email && touched.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Phone
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={getInputClassName('phone')}
                                required
                                placeholder="+61 4XX XXX XXX"
                            />
                            {errors.phone && touched.phone && (
                                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                                Image URL
                            </label>
                            <input
                                type="url"
                                id="imageUrl"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={getInputClassName('imageUrl')}
                                required
                            />
                            {errors.imageUrl && touched.imageUrl && (
                                <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>
                            )}
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {mode === 'add' ? 'Add Staff' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StaffModal; 