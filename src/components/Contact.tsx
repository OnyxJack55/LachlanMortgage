import React from 'react';
import ContactForm from './ContactForm';

interface ContactProps {
  title?: string;
  description?: string;
}

const Contact: React.FC<ContactProps> = ({ 
  title = "Contact Us",
  description = "Have a question or want to work together? We'd love to hear from you!"
}) => {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
          {title}
        </h2>
        <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          {description}
        </p>
        <ContactForm />
      </div>
    </section>
  );
};

export default Contact; 