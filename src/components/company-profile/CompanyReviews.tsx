import React from 'react';
import { Star } from 'lucide-react';
import { Container } from '@/components/layout/Container';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  company: any;
}

export function CompanyReviews({ company }: Props) {
  // Hide if no structured review data exists
  if (!company.reviews || !Array.isArray(company.reviews) || company.reviews.length === 0) {
    return null;
  }

  const avgRating = company.average_rating || 5.0;
  const totalReviews = company.total_reviews || company.reviews.length;

  return (
    <section className="py-16 md:py-24 bg-white border-b border-zinc-100">
      <Container>
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tight mb-2">Trekkers Love Us</h2>
            <p className="text-zinc-500 text-lg">Real experiences from our community</p>
          </div>
          <div className="md:ml-auto flex items-center gap-4 bg-zinc-50 px-6 py-4 rounded-2xl border border-zinc-100 shadow-sm">
            <div className="text-4xl font-black text-zinc-900">{avgRating.toFixed(1)}</div>
            <div>
              <div className="flex text-amber-500 mb-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <div className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Based on {totalReviews} reviews</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {company.reviews.map((review: any, idx: number) => (
            <div key={idx} className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100 shadow-sm">
              <div className="flex text-amber-500 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-4 h-4 ${s <= (review.rating || 5) ? 'fill-current' : 'text-zinc-300'}`} />
                ))}
              </div>
              <p className="text-zinc-700 italic mb-6">"{review.comment}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-tb-primary/10 text-tb-primary rounded-full flex items-center justify-center font-bold">
                  {review.author?.[0] || 'T'}
                </div>
                <div>
                  <div className="font-bold text-sm text-zinc-900">{review.author || 'Trekker'}</div>
                  <div className="text-xs text-zinc-500 font-medium">{review.date || 'Verified Review'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
