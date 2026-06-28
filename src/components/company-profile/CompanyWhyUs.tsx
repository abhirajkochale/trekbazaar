import React from 'react';
import { Shield, CheckCircle, Heart, Star, Award, Zap } from 'lucide-react';
import { Container } from '@/components/layout/Container';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  company: any;
}

export function CompanyWhyUs({ company }: Props) {
  // We explicitly check for structured company data as requested.
  // If the company record doesn't have a specific `why_us` array/object, we hide the section.
  const features = company.why_us; // e.g. ["Certified Leaders", "Medical Support"]

  if (!features || !Array.isArray(features) || features.length === 0) return null;

  // Simple icon mapper based on string content
  const getIcon = (text: string) => {
    const t = text.toLowerCase();
    if (t.includes('certif') || t.includes('qualif')) return <Award className="w-6 h-6 text-tb-primary" />;
    if (t.includes('medic') || t.includes('safe')) return <Shield className="w-6 h-6 text-blue-500" />;
    if (t.includes('equip') || t.includes('gear')) return <Zap className="w-6 h-6 text-amber-500" />;
    if (t.includes('exper')) return <Star className="w-6 h-6 text-purple-500" />;
    if (t.includes('care') || t.includes('support')) return <Heart className="w-6 h-6 text-rose-500" />;
    return <CheckCircle className="w-6 h-6 text-emerald-500" />;
  };

  return (
    <section className="py-16 md:py-24 bg-zinc-50 border-b border-zinc-100">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tight mb-4">Why Trek With {company.name}</h2>
          <p className="text-zinc-500 text-lg">What sets us apart on the mountains.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature: string, idx: number) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm flex items-start gap-4 hover:shadow-md hover:border-tb-primary/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0">
                {getIcon(feature)}
              </div>
              <div>
                <h3 className="font-bold text-lg text-zinc-900 mb-1">{feature}</h3>
                <p className="text-sm text-zinc-500 font-medium leading-relaxed">
                  We guarantee industry-leading standards for this aspect of your trek.
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
