import React from 'react';
import { motion } from 'framer-motion';

interface AboutProps {
  title: string;
  content: string;
  mission: string;
  vision: string;
  experience: string;
  image: string;
}

export default function About({
  title = "About Our Company",
  content = "We are dedicated to delivering innovative solutions that transform businesses and drive success in the digital age.",
  mission = "To empower businesses with cutting-edge technology solutions that drive growth, innovation, and sustainable success in an ever-evolving digital landscape.",
  vision = "To be the leading force in digital transformation, recognized globally for our innovative solutions and commitment to client success.",
  experience = "10+",
  image = "/about-image.jpg"
}: AboutProps) {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {content}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-600">{mission}</p>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
            <p className="text-gray-600">{vision}</p>
          </motion.div>

          {/* Experience Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Experience</h3>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <span className="block text-5xl font-bold text-indigo-600 mb-2">{experience}</span>
                <span className="text-gray-600">Years of Excellence</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Additional Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 flex flex-col lg:flex-row items-center gap-12"
        >
          <div className="lg:w-1/2">
            <img
              src={image}
              alt="About Our Company"
              className="rounded-lg shadow-lg w-full h-auto object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/600x400?text=About+Our+Company';
              }}
            />
          </div>
          <div className="lg:w-1/2">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Us?</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-indigo-600 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-gray-600">Expert team with years of industry experience</p>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-indigo-600 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-gray-600">Innovative solutions tailored to your needs</p>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-indigo-600 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-gray-600">Proven track record of successful projects</p>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 