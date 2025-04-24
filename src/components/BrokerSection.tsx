import React from 'react';
import { useStaff } from '../context/StaffContext';

const BrokerSection: React.FC = () => {
    const { staffMembers } = useStaff();

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Meet Our Team
                    </h2>
                    <p className="mt-4 text-lg text-gray-500">
                        Our experienced mortgage brokers are here to help you find the right loan.
                    </p>
                </div>
                <div className="mt-12 flex flex-wrap justify-center gap-8">
                    {staffMembers.map((broker, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.34rem)] xl:w-[calc(25%-1.5rem)] max-w-sm"
                        >
                            <div className="bg-white overflow-hidden shadow-lg rounded-lg h-full">
                                <div className="aspect-w-3 aspect-h-4">
                                    <img
                                        className="w-full h-64 object-cover"
                                        src={broker.imageUrl}
                                        alt={broker.name}
                                    />
                                </div>
                                <div className="px-6 py-4">
                                    <h3 className="text-lg font-medium text-gray-900">{broker.name}</h3>
                                    <p className="text-sm text-gray-500">{broker.position}</p>
                                    <div className="mt-4 space-y-2">
                                        <p className="text-sm text-gray-600 break-words">
                                            <a href={`mailto:${broker.email}`} className="hover:text-indigo-600">
                                                {broker.email}
                                            </a>
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <a href={`tel:${broker.phone}`} className="hover:text-indigo-600">
                                                {broker.phone}
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BrokerSection; 