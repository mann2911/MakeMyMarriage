import type { ReactNode } from "react";

const shapes = {
  overview: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4m10-4v4M3 11h18m-14 4h3" /></>,
  guests: <><circle cx="9" cy="8" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3m1-16a3 3 0 0 1 0 6m3 10v-3a6 6 0 0 0-2-4" /></>,
  tasks: <><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></>,
  wallet: <><path d="M20 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h15V8H5a3 3 0 0 1 0-6" /><path d="M20 12h-5v5h5m-3-2.5h.01" /></>,
  vendor: <><path d="M3 10 5 3h14l2 7M4 10v11h16V10M2 10c0 4 5 4 5 0 0 4 5 4 5 0 0 4 5 4 5 0 0 4 5 4 5 0M8 21v-7h8v7" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 6 9 7 9-7" /></>,
  website: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 9v12m-3-15h.01m3 0h.01" /></>,
  photo: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8" cy="8" r="1.5" /><path d="m3 17 5-5 4 4 4-6 5 7" /></>,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />,
  collaborators: <><circle cx="9" cy="8" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3m3-12v6m-3-3h6" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  location: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  sparkle: <><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z" /><path d="m21 2-1 3-3 1 3 1 1 3 1-3 3-1-3-1-1-3Z" /></>,
  chevron: <path d="m9 5 7 7-7 7" />,
} satisfies Record<string, ReactNode>;

export type DashboardIconName = keyof typeof shapes;

export function DashboardIcon({ name, size = 20 }: { name: DashboardIconName; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[name]}</svg>;
}

export function DashboardBrand() {
  return <div className="dashboard-brand">
    <svg width="38" height="30" viewBox="0 0 128 88" fill="none" aria-hidden="true">
      <path d="M12 70V26c0-8 10-12 16-6l17 22 17-22c6-6 16-2 16 6v44" stroke="#695078" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M45 70V26c0-8 10-12 16-6l17 22 17-22c6-6 16-2 16 6v44" stroke="#9375A3" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="61.5" cy="38" r="4.5" fill="#695078" />
    </svg>
    <div><span>MakeMyMarriage</span><small>Curated planning</small></div>
  </div>;
}
