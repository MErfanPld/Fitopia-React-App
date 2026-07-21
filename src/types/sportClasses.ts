/**
 * @file sportClasses.ts
 * @description Type definitions for gym sports/classes with coach schedules
 */

export interface SportClass {
  id: number;
  name: string;
  category: number;
  coach?: CoachInfo;
  schedule?: ClassSchedule[];
  sessions?: ClassSession[];
}

export interface CoachInfo {
  id: number;
  full_name: string;
  image?: string;
  specialty: string;
}

export interface ClassSchedule {
  id: number;
  day: string;
  start_time: string;
  end_time: string;
  coach: CoachInfo;
}

export interface ClassSession {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  coach: CoachInfo;
  participants_count: number;
  max_capacity: number;
}

export type SportClassesResponse = SportClass[];
