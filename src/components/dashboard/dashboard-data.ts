// Fictional design data. Nothing in this module represents a signed-in user's wedding.
export const previewDate = "2027-01-15";
export const weddingDate = "2027-02-14";

export type Celebration = {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  invitedPeople: number;
  invitedFamilies: number;
  attendingFamilies: number;
  declinedFamilies: number;
  confirmedPeople: number;
};

export const celebrations: Celebration[] = [
  { id: "mehndi", name: "Mehndi", date: "2027-02-11", time: "16:00", venue: "Emerald Lawn, Mumbai", invitedPeople: 180, invitedFamilies: 68, attendingFamilies: 45, declinedFamilies: 3, confirmedPeople: 124 },
  { id: "garba", name: "Garba & Sangeet Night", date: "2027-02-12", time: "19:00", venue: "The Grand Ballroom, Mumbai", invitedPeople: 380, invitedFamilies: 125, attendingFamilies: 82, declinedFamilies: 8, confirmedPeople: 258 },
  { id: "haldi", name: "Haldi & Pithi", date: "2027-02-13", time: "10:30", venue: "Courtyard Pavilion, Mumbai", invitedPeople: 140, invitedFamilies: 52, attendingFamilies: 35, declinedFamilies: 2, confirmedPeople: 96 },
  { id: "wedding", name: "Wedding Ceremony", date: weddingDate, time: "10:00", venue: "Mandap at Palace Gardens, Mumbai", invitedPeople: 500, invitedFamilies: 160, attendingFamilies: 110, declinedFamilies: 10, confirmedPeople: 360 },
  { id: "reception", name: "Evening Reception & Dinner", date: "2027-02-15", time: "19:30", venue: "Palace Gardens & Banquet, Mumbai", invitedPeople: 450, invitedFamilies: 148, attendingFamilies: 98, declinedFamilies: 6, confirmedPeople: 306 },
];

export type PlanningTask = { id: string; title: string; assignee: string; due: string; completed: boolean };

const priorityTasks: PlanningTask[] = [
  { id: "menu", title: "Finalize Mehndi caterer menu adjustments", assignee: "Aarav", due: "2027-01-12", completed: false },
  { id: "hampers", title: "Approve physical sample of guest welcome hampers", assignee: "Meera", due: "2027-01-14", completed: false },
  { id: "invitations", title: "Send digital Kankotri to extended family", assignee: "Aarav’s dad", due: "2027-01-18", completed: false },
  { id: "playlist", title: "Review DJ playlist and sound equipment for Garba", assignee: "Meera", due: "2027-01-22", completed: false },
  { id: "ceremony", title: "Confirm priest and ceremonial essentials", assignee: "Meera’s mum", due: "2027-01-25", completed: false },
];

const completedTitles = ["Choose the wedding date", "Set the wedding budget", "Book the wedding venue", "Confirm reception venue", "Book the photographer", "Choose the caterer", "Confirm decor palette", "Book the Mehndi artist", "Reserve guest accommodation", "Shortlist wedding outfits", "Choose invitation wording", "Prepare the family guest list", "Book the DJ", "Confirm transport vendor", "Schedule outfit fittings", "Book hair and makeup", "Choose the wedding cake", "Confirm ceremony timing"];
const remainingTitles = ["Confirm guest transport schedule", "Review seating arrangements", "Prepare the ceremony welcome board", "Confirm final outfit fittings", "Pack the family welcome hampers", "Review reception lighting", "Share the schedule with vendors"];

export const planningTasks: PlanningTask[] = [
  ...priorityTasks,
  ...remainingTitles.map((title, i) => ({ id: `upcoming-${i}`, title, assignee: i % 2 ? "Aarav" : "Meera", due: `2027-01-${String(26 + Math.floor(i / 2)).padStart(2, "0")}`, completed: false })),
  ...completedTitles.map((title, i) => ({ id: `completed-${i}`, title, assignee: i % 2 ? "Aarav" : "Meera", due: "2027-01-10", completed: true })),
];

export const budget = {
  total: 1_500_000,
  paid: 800_000,
  categories: [
    { name: "Venue & properties", amount: 400_000, color: "#695078" },
    { name: "Catering & dining", amount: 350_000, color: "#95819f" },
    { name: "Decor & florals", amount: 180_000, color: "#aa9589" },
    { name: "Photography & cinematography", amount: 150_000, color: "#7c8b79" },
    { name: "Outfits & styling", amount: 120_000, color: "#c4a35e" },
  ],
};

export const upcomingPayments = [
  { vendor: "Palace Gardens Venue", category: "Venue balance", date: "2027-01-20", amount: 150_000 },
  { vendor: "Royal Caterers", category: "Catering instalment", date: "2027-01-25", amount: 120_000 },
  { vendor: "Studio Lumière", category: "Photography balance", date: "2027-02-01", amount: 80_000 },
];

export function currency(amount: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

export function dateLabel(date: string, options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" }) {
  return new Intl.DateTimeFormat("en-GB", { ...options, timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
}

export function timeLabel(time: string) {
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC" }).format(new Date(`2027-01-15T${time}:00Z`));
}

export function daysUntil(date: string) {
  return Math.round((Date.parse(`${date}T00:00:00Z`) - Date.parse(`${previewDate}T00:00:00Z`)) / 86_400_000);
}
