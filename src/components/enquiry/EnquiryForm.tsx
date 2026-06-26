"use client";

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';

interface EnquiryFormProps {
  trek: {
    id: string;
    slug: string;
    title: string;
  };
  onSuccess: () => void;
}

export function EnquiryForm({ trek, onSuccess }: EnquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    travellers: 1,
    preferred_month: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Basic Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    
    if (formData.travellers < 1) {
      setError("Number of travellers must be at least 1.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const supabase = createClient();
    
    // Insert into Supabase
    const { error: insertError } = await supabase.from('enquiries').insert({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      travellers: formData.travellers,
      preferred_month: formData.preferred_month || null,
      message: formData.message.trim() || null,
      trek_id: trek.id,
      trek_slug: trek.slug,
      trek_name: trek.title,
      status: "new"
    });

    if (insertError) {
      console.error("Enquiry submission failed:", insertError);
      setError("Something went wrong while submitting your enquiry. Please try again.");
      setIsSubmitting(false);
    } else {
      onSuccess();
    }
  };

  const inputClasses = "w-full rounded-tb-md border border-tb-border bg-white px-3 py-2 text-sm text-tb-text-primary placeholder:text-tb-text-tertiary focus:outline-none focus:ring-2 focus:ring-tb-primary focus:border-tb-primary transition-colors";
  const labelClasses = "block text-sm font-medium text-tb-text-secondary mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 px-1 py-1">
      {error && (
        <div className="bg-tb-danger/10 border border-tb-danger/20 text-tb-danger text-sm px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className={labelClasses}>Full Name *</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          required 
          value={formData.name}
          onChange={handleChange}
          className={inputClasses} 
          placeholder="John Doe"
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="email" className={labelClasses}>Email *</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            value={formData.email}
            onChange={handleChange}
            className={inputClasses} 
            placeholder="john@example.com"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClasses}>Phone Number *</label>
          <input 
            type="tel" 
            id="phone" 
            name="phone" 
            required 
            value={formData.phone}
            onChange={handleChange}
            className={inputClasses} 
            placeholder="+91 98765 43210"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="travellers" className={labelClasses}>Number of Travellers *</label>
          <input 
            type="number" 
            id="travellers" 
            name="travellers" 
            required 
            min="1"
            value={formData.travellers}
            onChange={handleChange}
            className={inputClasses} 
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="preferred_month" className={labelClasses}>Preferred Month</label>
          <select 
            id="preferred_month" 
            name="preferred_month"
            value={formData.preferred_month}
            onChange={handleChange}
            className={inputClasses}
            disabled={isSubmitting}
          >
            <option value="">I&apos;m flexible</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClasses}>Message (Optional)</label>
        <textarea 
          id="message" 
          name="message" 
          rows={3}
          value={formData.message}
          onChange={handleChange}
          className={`${inputClasses} resize-none`} 
          placeholder="Any specific requirements or questions?"
          disabled={isSubmitting}
        />
      </div>

      <div className="pt-2">
        <Button 
          type="submit" 
          variant="primary" 
          size="lg" 
          fullWidth 
          isLoading={isSubmitting}
          className="h-12 text-base font-bold"
        >
          Submit Enquiry
        </Button>
      </div>
    </form>
  );
}
