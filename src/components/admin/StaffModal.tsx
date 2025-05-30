import React, { useState, useEffect } from 'react';
import { storage } from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL, ref as storageRef, deleteObject } from 'firebase/storage';

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

    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

    useEffect(() => {
        if (staff && mode === 'edit') {
            setFormData(staff);
            if (!POSITIONS.includes(staff.position as typeof POSITIONS[number])) {
                setShowCustomPosition(true);
                setCustomPosition(staff.position);
            }
            setUploadedImageUrl(null);
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
            setUploadedImageUrl(null);
        }
        setErrors({});
        setTouched({
            name: false,
            position: false,
            email: false,
            phone: false,
            imageUrl: false
        });
        setUploadError(null);
        setUploadProgress(0);
        setUploading(false);
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
                    return 'Please enter a valid email address';
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

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setUploadError(null);
        const file = e.dataTransfer.files[0];
        await handleFileUpload(file);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setUploadError(null);
        const file = e.target.files?.[0];
        if (file) {
            await handleFileUpload(file);
        }
    };

    const handleFileUpload = async (file: File) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            setUploadError('Only JPG, JPEG, PNG, GIF, and WEBP files are allowed.');
            return;
        }
        setUploading(true);
        setUploadProgress(0);
        try {
            const storageRef = ref(storage, `staff-images/${Date.now()}-${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => {
                    setUploadError('Upload failed. Please try again.');
                    setUploading(false);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    setUploadedImageUrl(downloadURL);
                    setFormData(prev => ({ ...prev, imageUrl: downloadURL }));
                    setUploading(false);
                }
            );
        } catch (err) {
            setUploadError('Upload failed. Please try again.');
            setUploading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: FormErrors = {};
        let hasErrors = false;
        (Object.keys(formData) as Array<keyof StaffMember>).forEach(field => {
            // Allow imageUrl to be blank if uploadedImageUrl is set
            if (field === 'imageUrl' && (formData.imageUrl || uploadedImageUrl)) return;
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
            onSave({ ...formData, imageUrl: uploadedImageUrl || formData.imageUrl });
        }
    };

    // Delete uploaded image if modal is cancelled before saving (add mode only)
    const handleCancel = async () => {
        if (mode === 'add' && uploadedImageUrl && uploadedImageUrl.includes('firebasestorage.googleapis.com')) {
            try {
                const match = uploadedImageUrl.match(/\/o\/(.*?)\?/);
                if (match && match[1]) {
                    const filePath = decodeURIComponent(match[1]);
                    await deleteObject(storageRef(storage, filePath));
                }
            } catch (err) {
                console.error('Failed to delete uploaded image on cancel:', err);
            }
        }
        onClose();
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
                                placeholder="Paste an image URL or use the upload below"
                            />
                            {errors.imageUrl && touched.imageUrl && (
                                <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>
                            )}
                            <div
                                onDrop={handleDrop}
                                onDragOver={e => e.preventDefault()}
                                className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-md text-center cursor-pointer bg-gray-50 hover:bg-gray-100"
                            >
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/gif,image/webp,image/jpg"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="fileUpload"
                                />
                                <label htmlFor="fileUpload" className="cursor-pointer block">
                                    Drag and drop an image here, or <span className="text-indigo-600 underline">click to select a file</span><br/>
                                    <span className="text-xs text-gray-500">(JPG, JPEG, PNG, GIF, WEBP only)</span>
                                </label>
                                {uploading && (
                                    <div className="mt-2 text-sm text-gray-700">Uploading: {uploadProgress.toFixed(0)}%</div>
                                )}
                                {uploadError && (
                                    <div className="mt-2 text-sm text-red-600">{uploadError}</div>
                                )}
                                {uploadedImageUrl && (
                                    <div className="mt-2">
                                        <img src={uploadedImageUrl} alt="Uploaded preview" className="mx-auto h-20 w-20 object-cover rounded-full border" />
                                        <div className="text-xs text-green-700 mt-1">Upload successful!</div>
                                    </div>
                                )}
                            </div>
                            {/* Preview section for main page aspect ratio */}
                            {(formData.imageUrl || uploadedImageUrl) && (
                                <div className="mt-6">
                                    <div className="aspect-w-3 aspect-h-4 w-full max-w-xs mx-auto bg-white rounded-lg overflow-hidden border">
                                        <img
                                            src={uploadedImageUrl || formData.imageUrl}
                                            alt="Main page preview"
                                            className="w-full h-64 object-cover rounded-lg"
                                        />
                                    </div>
                                    <div className="text-xs text-gray-500 mt-2 text-center">
                                        Preview: This is how the image will appear on the main page. For best results, use a portrait photo.
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                type="button"
                                onClick={handleCancel}
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