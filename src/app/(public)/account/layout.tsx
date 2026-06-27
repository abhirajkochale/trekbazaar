import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AccountAuthLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }
  
  // Renders no UI shell! Just passes children through, ensuring it renders inside the Public Layout.
  return <>{children}</>;
}
