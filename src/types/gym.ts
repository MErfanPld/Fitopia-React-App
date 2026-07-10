export interface Gym {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  cover_image: string;
  working_hours: string;
  rules: string;
  instagram: string;
  telegram: string;
  website: string;
  whatsapp: string;
  popularity_score: number;
  is_popular: boolean;
  sports: number[];
  facilities: number[];
}

export interface UserLocation {
  lat: number | null;
  lon: number | null;
}
