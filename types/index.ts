export type Attempt = {
  id: string;
  date: Date;
  attempts: number;
  send: boolean;
  notes: string;
};

export enum ClimbType {
  SPORT = 'sport',
  TRAD = 'trad',
  BOULDER = 'boulder'
}

export type Note = {
  id: string;
  name: string;
  area: string;
  grade: string;
  category: ClimbType;
  description: string;
  image?: string;
  video?: string;
  attempts: Attempt[];
};

export const V_GRADES = Array.from({ length: 18 }, (_, i) => `V${i}`);
export const STORAGE_KEY = '@ticklist_climbs'; 