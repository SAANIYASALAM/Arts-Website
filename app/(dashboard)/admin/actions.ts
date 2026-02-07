'use server'

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function createArtsEvent(formData: FormData) {
  const supabase = await createClient();
  
  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  
  const { data: userData } = await supabase
    .from('Users')
    .select('role')
    .eq('user_id', user.id)
    .single();
  
  if (userData?.role !== 'Admin') {
    redirect('/login');
  }
  
  const data = {
    event_name: formData.get('event_name') as string,
    is_group: formData.get('is_group') as 'Single' | 'Group',
    slots_per_house: parseInt(formData.get('slots_per_house') as string),
    max_participants: parseInt(formData.get('max_participants') as string),
    max_accompanists: parseInt(formData.get('max_accompanists') as string) || 0,
    first_pts: parseInt(formData.get('first_pts') as string),
    second_pts: parseInt(formData.get('second_pts') as string),
    third_pts: parseInt(formData.get('third_pts') as string),
  };
  
  await supabase
    .from('Arts_Events')
    .insert(data);
  
  revalidatePath('/admin/events');
}

export async function createSportsEvent(formData: FormData) {
  const supabase = await createClient();
  
  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  
  const { data: userData } = await supabase
    .from('Users')
    .select('role')
    .eq('user_id', user.id)
    .single();
  
  if (userData?.role !== 'Admin') {
    redirect('/login');
  }
  
  const data = {
    event_name: formData.get('event_name') as string,
    is_group: formData.get('is_group') as 'Individual' | 'Team',
    slots_per_house: parseInt(formData.get('slots_per_house') as string),
    max_participants: parseInt(formData.get('max_participants') as string),
    first_pts: parseInt(formData.get('first_pts') as string),
    second_pts: parseInt(formData.get('second_pts') as string),
    third_pts: parseInt(formData.get('third_pts') as string),
  };
  
  await supabase
    .from('Sports_Events')
    .insert(data);
  
  revalidatePath('/admin/events');
}
