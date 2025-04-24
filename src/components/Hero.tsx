import React from 'react';
import { motion } from 'framer-motion';

interface HeroProps {
  businessName: string;
}

export default function Hero({ businessName }: HeroProps) {
  return (
    <div className="relative py-20 overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 -left-4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -50, 20, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
          animate={{
            x: [0, -30, 20, 0],
            y: [0, 50, -20, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "linear",
            delay: 2
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
          animate={{
            x: [0, 20, -30, 0],
            y: [0, -20, 50, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "linear",
            delay: 4
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
            {businessName}
          </h1>
          <div className="mt-8 space-y-4">
            <p className="text-xl text-white/90">
              <span className="font-semibold">Email:</span>{' '}
              <a href="mailto:contact@lachlanmortgage.com" className="hover:underline">
                contact@lachlanmortgage.com
              </a>
            </p>
            <p className="text-xl text-white/90">
              <span className="font-semibold">Phone:</span>{' '}
              <a href="tel:+61400123456" className="hover:underline">
                +61 400 123 456
              </a>
            </p>
            <p className="text-xl text-white/90">
              <span className="font-semibold">Address:</span>{' '}
              123 Business Street, Sydney, NSW 2000
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 