import React from 'react';
import { Container } from '@/components/layout/Container';
import { ShieldCheck, HeartPulse, Leaf, Users, CheckCircle } from 'lucide-react';

export function TrustSection() {
  const trustItems = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      title: "Verified Operator",
      desc: "Fully registered and verified by TrekBazaar."
    },
    {
      icon: <HeartPulse className="w-6 h-6 text-rose-500" />,
      title: "Medical Support",
      desc: "Oxygen cylinders & first-aid equipped."
    },
    {
      icon: <Users className="w-6 h-6 text-blue-500" />,
      title: "Certified Leaders",
      desc: "BMC/AMC certified trek leaders."
    },
    {
      icon: <Leaf className="w-6 h-6 text-green-500" />,
      title: "Eco Friendly",
      desc: "Strict leave-no-trace policy enforced."
    }
  ];

  return (
    <section className="py-16 bg-white border-t border-zinc-100">
      <Container>
        <div className="max-w-4xl">
          <h2 className="text-2xl font-bold text-zinc-900 mb-8">Why Choose This Operator</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trustItems.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 p-6 rounded-2xl bg-zinc-50 border border-zinc-100">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 mb-1">{item.title}</h3>
                  <p className="text-sm font-medium text-zinc-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
