import React from 'react';

interface TestimonialCardProps {
  quote: string;
  name: string;
  role?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, role }) => {
  return (
    <div className="group relative bg-white rounded-xl shadow-md p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Quote Icon */}
        <div className="text-4xl text-blue-600 mb-4 transform group-hover:scale-110 transition-transform duration-300">"</div>
        
        {/* Quote */}
        <p className="text-gray-600 italic mb-6">
          {quote}
        </p>
        
        {/* Author Info */}
        <div className="flex items-center">
          <div className="relative">
            <img 
              src="https://placehold.co/100x100" 
              alt={name}
              className="w-12 h-12 rounded-full ring-2 ring-blue-600 group-hover:ring-purple-600 transition-colors duration-300"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div className="ml-4">
            <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {name}
            </h4>
            {role && (
              <p className="text-sm text-gray-500 group-hover:text-purple-600 transition-colors">
                {role}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

interface TestimonialsProps {
  title?: string;
  testimonials: Testimonial[];
}

const Testimonials: React.FC<TestimonialsProps> = ({ 
  title = "What Our Clients Say",
  testimonials
}) => {
  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
          {title}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <TestimonialCard
                quote={testimonial.quote}
                name={testimonial.name}
                role={testimonial.role}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 