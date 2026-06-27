"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '../layout/Container';
import { motion } from 'framer-motion';

export function CTASection() {
  return (
    <section className="relative w-full py-32 md:py-40 overflow-hidden flex items-center justify-center">
      {/* Background Image with motion */}
      <motion.div 
        initial={{ scale: 1.1 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <Image 
          src="https://images.unsplash.com/photo-1544198365-f5d60b6d8190?auto=format&fit=crop&q=80&w=2400"
          alt="Trekkers walking on a mountain ridge"
          fill
          className="object-cover opacity-90"
          sizes="100vw"
        />
      </motion.div>
      
      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/80 z-0" />
      
      <Container className="relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            Ready for the ascent?
          </h2>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto font-medium">
            Join thousands of trekkers who have found their perfect Himalayan adventure through TrekBazaar. Your next great story starts here.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/search"
              className="inline-flex items-center justify-center px-10 py-4 text-base font-bold text-black bg-white hover:bg-zinc-100 hover:scale-105 active:scale-95 rounded-full transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)]"
            >
              Start Exploring
            </Link>
            <Link 
              href="#contact"
              className="inline-flex items-center justify-center px-10 py-4 text-base font-bold text-white bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 border border-white/20 backdrop-blur-md rounded-full transition-all"
            >
              Talk to an Expert
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
