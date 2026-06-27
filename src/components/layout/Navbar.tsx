import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { NavbarClient } from './NavbarClient';

export async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Extract user details securely on the server
  const userData = user ? {
    id: user.id,
    email: user.email,
    firstName: user.user_metadata?.first_name || 'Trekker',
  } : null;

  return <NavbarClient user={userData} />;
}
