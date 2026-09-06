// Deterministic seeded RNG + shared name pools for generating
// interconnected, believable (fictional) intelligence-analysis mock data.

export function mulberry32(seed: number) {
  let a = seed;
  return function rand() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(rand: () => number, arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

export function pickN<T>(rand: () => number, arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length; i++) {
    const idx = Math.floor(rand() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

export function randInt(rand: () => number, min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

export const FIRST_NAMES_M = [
  'Arjun', 'Rajat', 'Vikram', 'Deepak', 'Manish', 'Suresh', 'Rohit', 'Karan',
  'Ajay', 'Sanjay', 'Amit', 'Nikhil', 'Farhan', 'Irfan', 'Aslam', 'Gaurav',
  'Rakesh', 'Sandeep', 'Vivek', 'Anil', 'Prakash', 'Yusuf', 'Salman', 'Zaid',
  'Harpreet', 'Gurpreet', 'Tarun', 'Ashok', 'Ravi', 'Naveen',
];
export const FIRST_NAMES_F = [
  'Priyanka', 'Sana', 'Neha', 'Pooja', 'Ritu', 'Kavita', 'Shreya', 'Anjali',
  'Meera', 'Divya', 'Farah', 'Zara', 'Simran', 'Kiran', 'Sunita', 'Rekha',
  'Ayesha', 'Nargis', 'Deepika', 'Swati',
];
export const LAST_NAMES = [
  'Malhotra', 'Verma', 'Singh Rathore', 'Chauhan', 'Nair', 'Ali', 'Sharma',
  'Kapoor', 'Iyer', 'Bhatt', 'Khan', 'Reddy', 'Joshi', 'Mehta', 'Gupta',
  'Chowdhury', 'Pillai', 'Desai', 'Qureshi', 'Bose', 'Rana', 'Thakur',
  'Sheikh', 'Naidu', 'Menon',
];

export const ORG_NAMES = [
  'Meridian Freight Logistics', 'Konnect Traders Pvt Ltd', 'Silverline Exports',
  'Bluewave Shipping Co.', 'Highline Realty Ventures', 'Zenith Cargo Solutions',
  'Ashford Import House', 'Coral Bay Trading', 'Nightingale Holdings',
  'Orient Star Freight', 'Vantage Metals & Minerals', 'Crescent Marine Agency',
];

export const CITIES: { name: string; lat: number; lng: number }[] = [
  { name: 'Mumbai', lat: 19.076, lng: 72.8777 },
  { name: 'Pune', lat: 18.5204, lng: 73.8567 },
  { name: 'Nashik', lat: 19.9975, lng: 73.7898 },
  { name: 'Thane', lat: 19.2183, lng: 72.9781 },
  { name: 'Surat', lat: 21.1702, lng: 72.8311 },
  { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
  { name: 'Delhi', lat: 28.7041, lng: 77.1025 },
  { name: 'Nagpur', lat: 21.1458, lng: 79.0882 },
];

export const MUMBAI_LOCALITIES: { name: string; lat: number; lng: number; category: string }[] = [
  { name: 'Bandra West', lat: 19.0596, lng: 72.8295, category: 'residential' },
  { name: 'Andheri East', lat: 19.1136, lng: 72.8697, category: 'commercial' },
  { name: 'Lower Parel', lat: 18.9982, lng: 72.8302, category: 'commercial' },
  { name: 'Colaba', lat: 18.9067, lng: 72.8147, category: 'port_area' },
  { name: 'Malad West', lat: 19.1875, lng: 72.8489, category: 'residential' },
  { name: 'Chembur', lat: 19.0522, lng: 72.9005, category: 'industrial' },
  { name: 'Powai', lat: 19.1176, lng: 72.906, category: 'residential' },
  { name: 'Dockyard Road', lat: 18.9647, lng: 72.8425, category: 'port_area' },
  { name: 'Kurla', lat: 19.0728, lng: 72.8826, category: 'transit_hub' },
  { name: 'Vashi', lat: 19.077, lng: 72.9986, category: 'commercial' },
];

export const DOC_TAGS = ['identity', 'financial', 'contract', 'travel', 'communication', 'property'];

export const SOCIAL_PLATFORMS = ['X', 'Instagram', 'Facebook', 'Telegram', 'WhatsApp'] as const;

export function isoOffsetDays(base: string, days: number, hours = 0, minutes = 0): string {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  d.setHours(d.getHours() + hours, d.getMinutes() + minutes);
  return d.toISOString();
}

export const NOW_ISO = '2026-09-04T14:32:00.000Z';
