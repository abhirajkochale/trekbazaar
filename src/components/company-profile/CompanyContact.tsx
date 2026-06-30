import React from 'react';
import { Mail, Phone, Globe, Camera, Users, Video } from 'lucide-react';
import { Container } from '@/components/layout/Container';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  company: any;
}

export function CompanyContact({ company }: Props) {
  // Determine if any contact info exists
  const hasContact = company.email || company.phone || company.website || company.instagram || company.facebook || company.youtube;

  if (!hasContact) return null;

  return (
    <section className="py-16 md:py-24 bg-zinc-900 border-b border-zinc-800 text-white">
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Contact {company.name}</h2>
          <p className="text-zinc-400 text-lg mb-12">Get in touch directly with the operator</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {company.phone && (
              <a href={`tel:${company.phone}`} className="flex items-center gap-4 bg-zinc-800 hover:bg-zinc-700 px-6 py-5 rounded-2xl transition-colors group">
                <div className="w-12 h-12 rounded-full bg-tb-primary/20 text-tb-primary flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-0.5">Call Us</div>
                  <div className="font-bold text-white group-hover:text-tb-primary transition-colors">{company.phone}</div>
                </div>
              </a>
            )}
            
            {company.email && (
              <a href={`mailto:${company.email}`} className="flex items-center gap-4 bg-zinc-800 hover:bg-zinc-700 px-6 py-5 rounded-2xl transition-colors group">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-0.5">Email Us</div>
                  <div className="font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">{company.email}</div>
                </div>
              </a>
            )}

            {company.website && (
              <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-zinc-800 hover:bg-zinc-700 px-6 py-5 rounded-2xl transition-colors group">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-0.5">Website</div>
                  <div className="font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-1">Visit Site</div>
                </div>
              </a>
            )}

            {company.instagram && (
              <a href={company.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-zinc-800 hover:bg-zinc-700 px-6 py-5 rounded-2xl transition-colors group">
                <div className="w-12 h-12 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
                  <Camera className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-0.5">Instagram</div>
                  <div className="font-bold text-white group-hover:text-pink-400 transition-colors line-clamp-1">Follow Us</div>
                </div>
              </a>
            )}

            {company.facebook && (
              <a href={company.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-zinc-800 hover:bg-zinc-700 px-6 py-5 rounded-2xl transition-colors group">
                <div className="w-12 h-12 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-0.5">Facebook</div>
                  <div className="font-bold text-white group-hover:text-blue-500 transition-colors line-clamp-1">Like Page</div>
                </div>
              </a>
            )}

            {company.youtube && (
              <a href={company.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-zinc-800 hover:bg-zinc-700 px-6 py-5 rounded-2xl transition-colors group">
                <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center shrink-0">
                  <Video className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-0.5">YouTube</div>
                  <div className="font-bold text-white group-hover:text-red-500 transition-colors line-clamp-1">Watch Videos</div>
                </div>
              </a>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
