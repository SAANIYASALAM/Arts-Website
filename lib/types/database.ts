export type UserRole = 'User' | 'Admin';
export type ArtsEventGroup = 'Group' | 'Single';
export type SportsEventGroup = 'Team' | 'Individual';
export type RegDetailsRole = 'participant' | 'accompanist';
export type WinnerPosition = '1' | '2' | '3';

export interface House {
  house_id: number;
  house_name: string;
}

export interface User {
  user_id: string;
  username: string;
  password?: string;
  role: UserRole;
  house_id: number | null;
  created_at?: string;
}

export interface Student {
  student_id: number;
  name: string;
  class: string | null;
  year: number | null;
  house_id: number | null;
  created_at?: string;
}

export interface ArtsEvent {
  event_id: number;
  event_name: string;
  is_group: ArtsEventGroup;
  slots_per_house: number;
  max_participants: number;
  max_accompanists: number;
  first_pts: number;
  second_pts: number;
  third_pts: number;
  created_at?: string;
}

export interface SportsEvent {
  event_id: number;
  event_name: string;
  is_group: SportsEventGroup;
  slots_per_house: number;
  max_participants: number;
  first_pts: number;
  second_pts: number;
  third_pts: number;
  created_at?: string;
}

export interface ArtsRegistration {
  arts_reg_id: number;
  event_id: number;
  house_id: number;
  created_at?: string;
}

export interface SportsRegistration {
  sports_reg_id: number;
  event_id: number;
  house_id: number;
  created_at?: string;
}

export interface ArtsRegDetail {
  detail_id: number;
  arts_reg_id: number;
  student_id: number;
  role: RegDetailsRole;
  created_at?: string;
}

export interface SportsRegDetail {
  detail_id: number;
  sports_reg_id: number;
  student_id: number;
  created_at?: string;
}

export interface ArtsWinner {
  winner_id: number;
  event_id: number;
  arts_reg_id: number;
  position: WinnerPosition;
  created_at?: string;
}

export interface SportsWinner {
  winner_id: number;
  event_id: number;
  sports_reg_id: number;
  position: number;
  created_at?: string;
}

export interface Database {
  public: {
    Tables: {
      Houses: {
        Row: House;
        Insert: Omit<House, 'house_id'>;
        Update: Partial<Omit<House, 'house_id'>>;
      };
      Users: {
        Row: User;
        Insert: Omit<User, 'created_at'>;
        Update: Partial<Omit<User, 'user_id' | 'created_at'>>;
      };
      Students: {
        Row: Student;
        Insert: Omit<Student, 'student_id' | 'created_at'>;
        Update: Partial<Omit<Student, 'student_id' | 'created_at'>>;
      };
      Arts_Events: {
        Row: ArtsEvent;
        Insert: Omit<ArtsEvent, 'event_id' | 'created_at'>;
        Update: Partial<Omit<ArtsEvent, 'event_id' | 'created_at'>>;
      };
      Sports_Events: {
        Row: SportsEvent;
        Insert: Omit<SportsEvent, 'event_id' | 'created_at'>;
        Update: Partial<Omit<SportsEvent, 'event_id' | 'created_at'>>;
      };
      Arts_Registrations: {
        Row: ArtsRegistration;
        Insert: Omit<ArtsRegistration, 'arts_reg_id' | 'created_at'>;
        Update: Partial<Omit<ArtsRegistration, 'arts_reg_id' | 'created_at'>>;
      };
      Sports_Registrations: {
        Row: SportsRegistration;
        Insert: Omit<SportsRegistration, 'sports_reg_id' | 'created_at'>;
        Update: Partial<Omit<SportsRegistration, 'sports_reg_id' | 'created_at'>>;
      };
      Arts_Reg_Details: {
        Row: ArtsRegDetail;
        Insert: Omit<ArtsRegDetail, 'detail_id' | 'created_at'>;
        Update: Partial<Omit<ArtsRegDetail, 'detail_id' | 'created_at'>>;
      };
      Sports_Reg_Details: {
        Row: SportsRegDetail;
        Insert: Omit<SportsRegDetail, 'detail_id' | 'created_at'>;
        Update: Partial<Omit<SportsRegDetail, 'detail_id' | 'created_at'>>;
      };
      Arts_Winners: {
        Row: ArtsWinner;
        Insert: Omit<ArtsWinner, 'winner_id' | 'created_at'>;
        Update: Partial<Omit<ArtsWinner, 'winner_id' | 'created_at'>>;
      };
      Sports_Winners: {
        Row: SportsWinner;
        Insert: Omit<SportsWinner, 'winner_id' | 'created_at'>;
        Update: Partial<Omit<SportsWinner, 'winner_id' | 'created_at'>>;
      };
    };
  };
}
