import React from 'react';
import { motion } from 'framer-motion';

export function SuccessState() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
    >
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
        className="w-20 h-20 bg-tb-success/10 rounded-full flex items-center justify-center mb-6"
      >
        <svg className="w-10 h-10 text-tb-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>
      
      <h3 className="text-2xl font-bold text-tb-text-primary mb-3">Enquiry Sent Successfully</h3>
      <p className="text-tb-text-secondary max-w-sm">
        Our trekking expert will contact you shortly to help plan your adventure.
      </p>
    </motion.div>
  );
}
