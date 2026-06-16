/**
 * Gym Interface defining the structure of Partner Sports Complexes.
 * Used for listing, map views, token consumption, and bookmarking.
 */
export interface Gym {
  id: string; // Unique identifier for the gym
  name: string; // Gym name in Persian
  image: string; // Public image URL or high-resolution photo reference
  rating: number; // Star rating (0.0 to 5.0)
  distance: string; // Distance from current user location with unit (e.g., '1.2 کیلومتر')
  tokensCost: number; // Token pricing required to book a session at this venue
  openHours: string; // Gym operation timing range in Persian
  popular?: boolean; // Flag to designate trending gyms of the week
}

/**
 * Static registry of premium partner fitness clubs in the FITOPIA network.
 * Pre-filled with real-world location metadata and optimized CDN imagery.
 */
export const gymsData: Gym[] = [
  {
    id: "gym-1",
    name: "باشگاه رویال پلاتینیوم",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvCfcGZdXEtSfU8ahd4Si9cTv-OVcsFJqXA-MOnuq-3KRHUj5ScGxCTgGBGHQ23ZMlhtUjuzF4eDjtzyp-XVz07_RNRcgBPvV7H1TO--SnS5VvWyo1LcJH6anMda25lGlPjkJmeYBX2RC1QWJcNlvCxpWeaZ9ITbhksBthBTmEiEMUpl82sVleS0bTE46KemlW7A6AEaKVsqjgnKGqdCqyWb_6w836IcIHYkj5YhIIIvUybjp9i0YNwoohF2KVm5WhdeZ_uHB-drHB",
    rating: 4.8,
    distance: "۱.۲ کیلومتر",
    tokensCost: 4,
    openHours: "۰۶:۰۰ تا ۲۳:۰۰",
    popular: true,
  },
  {
    id: "gym-2",
    name: "مرکز فیتنس تایتان",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAVgZx4KjV0xA003r1epSJoDBvCmRgDer8JP7tygrmYOkVfrzHQD8ttcAuhuWHI_tupjqg1QL1rdp26Gs2i8NQurTw6ff8QTEP70_FwyO97tunFPcSvGHju6M4uQy5nthg3NBy-bq1j3_rU_MYS7PrOyym6IyHqaEPs6IRSBk1dV2UBpuVmf4Q9EDwxUnotzNavXO2YQmQa8Jq0dER9jq4Cc0vmr7m8Fstu_Ij4tgzjklNlj5zdtVUczsEb884iHnw0bo9oDXcbNbcD",
    rating: 4.7,
    distance: "۳.۵ کیلومتر",
    tokensCost: 3,
    openHours: "۰۷:۰۰ تا ۲۲:۰۰",
    popular: false,
  },
  {
    id: "gym-3",
    name: "آکادمی بوکس و مبارزه اتم",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=350&q=80",
    rating: 4.9,
    distance: "۴.۸ کیلومتر",
    tokensCost: 5,
    openHours: "۰۸:۰۰ تا ۲۴:۰۰",
    popular: true,
  },
];

