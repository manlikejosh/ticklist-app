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

export const YDS_GRADES = [
  '5.0', '5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7', '5.8', '5.9',
  '5.10a', '5.10b', '5.10c', '5.10d',
  '5.11a', '5.11b', '5.11c', '5.11d',
  '5.12a', '5.12b', '5.12c', '5.12d',
  '5.13a', '5.13b', '5.13c', '5.13d',
  '5.14a', '5.14b', '5.14c', '5.14d',
  '5.15a', '5.15b', '5.15c', '5.15d'
];

export const STORAGE_KEY = '@ticklist_climbs'; 