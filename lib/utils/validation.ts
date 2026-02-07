import { createClient } from '@/lib/supabase/server';

export const PARTICIPATION_LIMITS = {
  ARTS_SINGLE: 4,
  ARTS_GROUP: 2,
  SPORTS_INDIVIDUAL: 3,
  SPORTS_TEAM: 2,
} as const;

interface ParticipationCount {
  artsSingle: number;
  artsGroup: number;
  sportsIndividual: number;
  sportsTeam: number;
}

/**
 * Get student's current participation counts across all event types
 */
export async function getStudentParticipationCounts(
  studentId: number
): Promise<ParticipationCount> {
  const supabase = await createClient();

  // Get all arts registrations for this student with event info
  const { data: artsDetails } = await supabase
    .from('Arts_Reg_Details')
    .select(`
      role,
      Arts_Registrations!inner (
        Arts_Events!inner (
          is_group
        )
      )
    `)
    .eq('student_id', studentId)
    .eq('role', 'participant');

  // Count arts single and group events
  let artsSingleCount = 0;
  let artsGroupCount = 0;
  
  if (artsDetails) {
    artsDetails.forEach((detail: any) => {
      const eventType = detail.Arts_Registrations?.Arts_Events?.is_group;
      if (eventType === 'Single') {
        artsSingleCount++;
      } else if (eventType === 'Group') {
        artsGroupCount++;
      }
    });
  }

  // Get all sports registrations for this student with event info
  const { data: sportsDetails } = await supabase
    .from('Sports_Reg_Details')
    .select(`
      Sports_Registrations!inner (
        Sports_Events!inner (
          is_group
        )
      )
    `)
    .eq('student_id', studentId);

  // Count sports individual and team events
  let sportsIndividualCount = 0;
  let sportsTeamCount = 0;
  
  if (sportsDetails) {
    sportsDetails.forEach((detail: any) => {
      const eventType = detail.Sports_Registrations?.Sports_Events?.is_group;
      if (eventType === 'Individual') {
        sportsIndividualCount++;
      } else if (eventType === 'Team') {
        sportsTeamCount++;
      }
    });
  }

  return {
    artsSingle: artsSingleCount,
    artsGroup: artsGroupCount,
    sportsIndividual: sportsIndividualCount,
    sportsTeam: sportsTeamCount,
  };
}

/**
 * Check if student can participate in an Arts event
 */
export async function canParticipateInArtsEvent(
  studentId: number,
  eventId: number,
  role: 'participant' | 'accompanist'
): Promise<{ canParticipate: boolean; reason?: string }> {
  // Accompanists don't count towards limits
  if (role === 'accompanist') {
    return { canParticipate: true };
  }

  const supabase = await createClient();

  // Get event type
  const { data: event } = await supabase
    .from('Arts_Events')
    .select('is_group')
    .eq('event_id', eventId)
    .single();

  if (!event) {
    return { canParticipate: false, reason: 'Event not found' };
  }

  const counts = await getStudentParticipationCounts(studentId);

  if (event.is_group === 'Single') {
    if (counts.artsSingle >= PARTICIPATION_LIMITS.ARTS_SINGLE) {
      return {
        canParticipate: false,
        reason: `Student has reached maximum limit of ${PARTICIPATION_LIMITS.ARTS_SINGLE} single arts events`,
      };
    }
  } else {
    if (counts.artsGroup >= PARTICIPATION_LIMITS.ARTS_GROUP) {
      return {
        canParticipate: false,
        reason: `Student has reached maximum limit of ${PARTICIPATION_LIMITS.ARTS_GROUP} group arts events`,
      };
    }
  }

  return { canParticipate: true };
}

/**
 * Check if student can participate in a Sports event
 */
export async function canParticipateInSportsEvent(
  studentId: number,
  eventId: number
): Promise<{ canParticipate: boolean; reason?: string }> {
  const supabase = await createClient();

  // Get event type
  const { data: event } = await supabase
    .from('Sports_Events')
    .select('is_group')
    .eq('event_id', eventId)
    .single();

  if (!event) {
    return { canParticipate: false, reason: 'Event not found' };
  }

  const counts = await getStudentParticipationCounts(studentId);

  if (event.is_group === 'Individual') {
    if (counts.sportsIndividual >= PARTICIPATION_LIMITS.SPORTS_INDIVIDUAL) {
      return {
        canParticipate: false,
        reason: `Student has reached maximum limit of ${PARTICIPATION_LIMITS.SPORTS_INDIVIDUAL} individual sports events`,
      };
    }
  } else {
    if (counts.sportsTeam >= PARTICIPATION_LIMITS.SPORTS_TEAM) {
      return {
        canParticipate: false,
        reason: `Student has reached maximum limit of ${PARTICIPATION_LIMITS.SPORTS_TEAM} team sports events`,
      };
    }
  }

  return { canParticipate: true };
}

/**
 * Check if house has available slots for an event
 */
export async function checkHouseSlots(
  houseId: number,
  eventId: number,
  eventType: 'arts' | 'sports'
): Promise<{ hasSlots: boolean; reason?: string }> {
  const supabase = await createClient();

  if (eventType === 'arts') {
    const { data: event } = await supabase
      .from('Arts_Events')
      .select('slots_per_house')
      .eq('event_id', eventId)
      .single();

    if (!event) {
      return { hasSlots: false, reason: 'Event not found' };
    }

    const { count } = await supabase
      .from('Arts_Registrations')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)
      .eq('house_id', houseId);

    if ((count || 0) >= event.slots_per_house) {
      return {
        hasSlots: false,
        reason: `House has used all ${event.slots_per_house} slots for this event`,
      };
    }
  } else {
    const { data: event } = await supabase
      .from('Sports_Events')
      .select('slots_per_house')
      .eq('event_id', eventId)
      .single();

    if (!event) {
      return { hasSlots: false, reason: 'Event not found' };
    }

    const { count } = await supabase
      .from('Sports_Registrations')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)
      .eq('house_id', houseId);

    if ((count || 0) >= event.slots_per_house) {
      return {
        hasSlots: false,
        reason: `House has used all ${event.slots_per_house} slots for this event`,
      };
    }
  }

  return { hasSlots: true };
}
