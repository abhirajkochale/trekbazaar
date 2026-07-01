import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'How It Works | TrekBazaar Partners',
  description: 'Understand the simple, transparent process from registration to receiving bookings.',
};

export default function HowItWorksPage() {
  const steps = [
    {
      id: 1,
      title: "Register",
      description: "Create your partner account in minutes. We only need basic contact information to get started."
    },
    {
      id: 2,
      title: "Verification",
      description: "We review your business documents, GST, and banking details to ensure safety for our trekkers."
    },
    {
      id: 3,
      title: "Get Approved",
      description: "Once verified, you get full access to the TrekBazaar partner dashboard and tools."
    },
    {
      id: 4,
      title: "List & Publish",
      description: "Select from our master treks, add your dates, set your capacity, and define your pricing."
    },
    {
      id: 5,
      title: "Get Bookings",
      description: "We bring you high-intent customers. Manage manifests and customer data directly in your dashboard."
    },
    {
      id: 6,
      title: "Get Paid",
      description: "Secure escrow. Automatic settlements straight to your bank account after every successful trek."
    }
  ];

  return (
    <div className="bg-white text-[#111827] min-h-screen font-sans selection:bg-[#0F3D2E] selection:text-white">
      
      {/* Header */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#111827] mb-6 leading-tight">
            Your journey from registration to receiving bookings.
          </h1>
          <p className="text-lg text-[#6B7280] leading-relaxed">
            Simple steps. Transparent process. We handle the heavy lifting so you can focus on what you do best — creating incredible trekking experiences.
          </p>
        </div>
      </section>

      {/* The Journey - Clean Linear List */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-16">
            {steps.map((step) => (
              <div key={step.id}>
                <div className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-sm font-medium text-[#111827] mb-6">
                  {step.id}
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3">
                  {step.title}
                </h3>
                <p className="text-[#6B7280] leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SLA Card */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
           <div className="bg-[#F6F7F9] p-8 md:p-12 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8">
             <div>
               <div className="text-sm font-medium text-[#6B7280] uppercase tracking-widest mb-2">Average Timeline</div>
               <h4 className="text-2xl font-bold text-[#111827]">7-14 days</h4>
               <p className="text-[#6B7280] mt-2">from application to going live on the platform.</p>
             </div>
             <Link 
                href="/partner/register" 
                className="inline-flex items-center justify-center bg-[#0F3D2E] hover:bg-[#0a291f] text-white font-medium px-8 h-12 rounded-lg text-base transition-colors shrink-0 w-full md:w-auto"
              >
                List Your Company
              </Link>
           </div>
        </div>
      </section>

    </div>
  );
}
