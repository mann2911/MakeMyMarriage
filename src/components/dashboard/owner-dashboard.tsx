"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { SignOut } from "@/components/auth/sign-out";
import { DashboardBrand, DashboardIcon, type DashboardIconName } from "./dashboard-icon";
import { budget, celebrations as initialCelebrations, currency, dateLabel, daysUntil, planningTasks, previewDate, timeLabel, upcomingPayments, weddingDate, type Celebration } from "./dashboard-data";

type Action = "family" | "event" | "invitation" | "details";
type SampleFamily = { name: string; people: number; eventId: string };
type NavItem = { label: string; icon: DashboardIconName; href?: string };

const navigation: { title: string; items: NavItem[] }[] = [
  { title: "Planning", items: [{ label: "Overview", icon: "overview", href: "#overview" }, { label: "Events", icon: "calendar", href: "#celebrations" }, { label: "Guests", icon: "guests", href: "#rsvp" }, { label: "Tasks", icon: "tasks", href: "#tasks" }] },
  { title: "Budget", items: [{ label: "Expenses", icon: "wallet", href: "#budget" }, { label: "Vendors", icon: "vendor", href: "#payments" }] },
  { title: "Sharing", items: [{ label: "Invitations", icon: "mail" }, { label: "Wedding website", icon: "website" }, { label: "Photos", icon: "photo" }] },
  { title: "Settings", items: [{ label: "Wedding details", icon: "heart" }, { label: "Collaborators", icon: "collaborators" }] },
];

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  return <nav aria-label="Wedding planning">
    {navigation.map(group => <div className="dashboard-nav-group" key={group.title}>
      <p>{group.title}</p>
      {group.items.map(item => item.href
        ? <a key={item.label} href={item.href} onClick={onNavigate} className={`dashboard-nav-item ${item.label === "Overview" ? "is-active" : ""}`} aria-current={item.label === "Overview" ? "page" : undefined}><DashboardIcon name={item.icon} /><span>{item.label}</span></a>
        : <button key={item.label} type="button" className="dashboard-nav-item" disabled title={`${item.label} is coming in a later milestone`}><DashboardIcon name={item.icon} /><span>{item.label}</span><span className="sr-only"> — coming soon</span></button>)}
    </div>)}
  </nav>;
}

function Progress({ value, label }: { value: number; label: string }) {
  return <div className="dashboard-progress" role="progressbar" aria-label={label} aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${value}%` }} /></div>;
}

export function OwnerDashboard({ displayName }: { displayName: string }) {
  const profileName = displayName.trim() || "Your account";
  const initials = profileName.split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase();
  const [events, setEvents] = useState(initialCelebrations);
  const [tasks, setTasks] = useState(planningTasks);
  const [families, setFamilies] = useState<SampleFamily[]>([]);
  const [rsvpEventId, setRsvpEventId] = useState("wedding");
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [action, setAction] = useState<Action | null>(null);
  const [detailEvent, setDetailEvent] = useState<Celebration | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const actionDialog = useRef<HTMLDialogElement>(null);
  const mobileMenu = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (action && !actionDialog.current?.open) actionDialog.current?.showModal();
  }, [action]);

  const sortedEvents = [...events].sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
  const nextEvent = sortedEvents[0];
  const rsvpEvent = events.find(event => event.id === rsvpEventId) ?? events[0];
  const addedFamilies = families.filter(family => family.eventId === rsvpEvent.id);
  const invitedFamilies = rsvpEvent.invitedFamilies + addedFamilies.length;
  const invitedPeople = rsvpEvent.invitedPeople + addedFamilies.reduce((total, family) => total + family.people, 0);
  const responded = rsvpEvent.attendingFamilies + rsvpEvent.declinedFamilies;
  const responseRate = invitedFamilies ? Math.round(responded / invitedFamilies * 100) : 0;
  const pendingFamilies = invitedFamilies - responded;
  const completed = tasks.filter(task => task.completed).length;
  const overdue = tasks.filter(task => !task.completed && task.due < previewDate).length;
  const committed = budget.categories.reduce((total, category) => total + category.amount, 0);
  const taskList = showAllTasks ? tasks : tasks.slice(0, 5);
  const actionTitle = action === "family" ? "Add a sample family" : action === "event" ? "Add a sample event" : action === "invitation" ? "Create invitation" : detailEvent?.name ?? "Event details";

  function openEvent(event: Celebration) {
    setDetailEvent(event);
    setAction("details");
  }

  function addFamily(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const people = Number(data.get("people"));
    const eventId = String(data.get("eventId"));
    if (!name || !Number.isInteger(people) || people < 1 || people > 500 || !events.some(item => item.id === eventId)) return;
    setFamilies(current => [...current, { name, people, eventId }]);
    setRsvpEventId(eventId);
    setAnnouncement(`${name} added to the sample guest list. The RSVP summary has been updated.`);
    actionDialog.current?.close();
  }

  function addEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const venue = String(data.get("venue") ?? "").trim();
    const date = String(data.get("date"));
    const time = String(data.get("time"));
    if (!name || !venue || !date || !time || date < previewDate) return;
    setEvents(current => [...current, { id: crypto.randomUUID(), name, venue, date, time, invitedPeople: 0, invitedFamilies: 0, attendingFamilies: 0, declinedFamilies: 0, confirmedPeople: 0 }]);
    setAnnouncement(`${name} added to the sample celebration schedule.`);
    actionDialog.current?.close();
  }

  return <div className="owner-dashboard">
    <a className="dashboard-skip" href="#dashboard-main">Skip to dashboard</a>
    <aside className="dashboard-sidebar">
      <DashboardBrand />
      <Navigation />
      <div className="dashboard-sidebar-note"><DashboardIcon name="heart" size={18} /><p>A little planning.<br /><strong>A lot of love.</strong></p></div>
      <SignOut className="dashboard-sign-out" buttonClassName="dashboard-button" />
    </aside>

    <div className="dashboard-workspace">
      <header className="dashboard-topbar">
        <button type="button" className="dashboard-menu-button dashboard-icon-button" onClick={() => mobileMenu.current?.showModal()} aria-label="Open planning navigation" aria-haspopup="dialog"><DashboardIcon name="menu" /></button>
        <div className="dashboard-wedding-identity"><div><span>Aarav &amp; Meera</span><span className="dashboard-badge badge-gold">Private planning</span></div><p><DashboardIcon name="calendar" size={14} />14 Feb 2027 · {daysUntil(weddingDate)} days to go</p></div>
        <span className="dashboard-preview-chip"><span />Design preview</span>
        <div className="dashboard-profile"><div><strong title={profileName}>{profileName}</strong><span className="dashboard-badge badge-plum">Owner preview</span></div><span className="dashboard-avatar" aria-hidden="true">{initials}</span></div>
      </header>

      <main id="dashboard-main" className="dashboard-main" tabIndex={-1}>
        <div className="dashboard-preview-note"><DashboardIcon name="sparkle" size={16} /><p><strong>Owner dashboard preview.</strong> Fictional data as of 15 January 2027. Changes here reset when you reload.</p></div>
        <section id="overview" className="dashboard-welcome" aria-labelledby="dashboard-heading">
          <div><p className="dashboard-eyebrow">Your wedding, beautifully organised</p><h1 id="dashboard-heading">Your celebration is<br className="dashboard-heading-break" /> taking shape.</h1><p className="dashboard-welcome-detail">Aarav &amp; Meera <span aria-hidden="true">·</span> 14 February 2027 <span className="dashboard-badge badge-gold">30 days to go</span></p></div>
          <div className="dashboard-actions"><button type="button" className="dashboard-button" onClick={() => setAction("event")}><DashboardIcon name="plus" size={17} />Add event</button><button type="button" className="dashboard-button" onClick={() => setAction("invitation")}><DashboardIcon name="mail" size={17} />Create invitation</button><button type="button" className="dashboard-button is-primary" onClick={() => setAction("family")}><DashboardIcon name="guests" size={18} />Add family</button></div>
        </section>

        <div className="dashboard-metrics">
          <section id="rsvp" className="dashboard-card dashboard-metric" aria-labelledby="rsvp-heading">
            <div className="dashboard-metric-header"><p className="dashboard-eyebrow" id="rsvp-heading">Event RSVP</p><span className="dashboard-metric-icon"><DashboardIcon name="mail" /></span></div>
            <label className="sr-only" htmlFor="rsvp-event">RSVP event</label><select id="rsvp-event" className="dashboard-event-select" value={rsvpEventId} onChange={event => setRsvpEventId(event.target.value)}>{sortedEvents.map(event => <option key={event.id} value={event.id}>{event.name}</option>)}</select>
            <p className="dashboard-metric-value">{responseRate}% <span>responded</span></p>
            <p className="dashboard-small">{responded} of {invitedFamilies} families</p>
            <div className="dashboard-rsvp-bar" role="img" aria-label={`${rsvpEvent.attendingFamilies} attending families, ${rsvpEvent.declinedFamilies} declined, ${pendingFamilies} pending`}><span style={{ width: `${invitedFamilies ? rsvpEvent.attendingFamilies / invitedFamilies * 100 : 0}%` }} /><span style={{ width: `${invitedFamilies ? rsvpEvent.declinedFamilies / invitedFamilies * 100 : 0}%` }} /></div>
            <div className="dashboard-rsvp-legend"><span><i />{rsvpEvent.attendingFamilies} attending</span><span><i />{rsvpEvent.declinedFamilies} declined</span><span><i />{pendingFamilies} pending</span></div>
            <p className="dashboard-metric-foot"><strong>{rsvpEvent.confirmedPeople}</strong> people confirmed · {invitedPeople} invited</p>
          </section>
          <section className="dashboard-card dashboard-metric" aria-labelledby="milestones-heading">
            <div className="dashboard-metric-header"><p className="dashboard-eyebrow" id="milestones-heading">Preparation milestones</p><span className="dashboard-metric-icon"><DashboardIcon name="tasks" /></span></div>
            <p className="dashboard-metric-value" aria-live="polite">{completed} <span>of {tasks.length} done</span></p><p className="dashboard-small">{Math.round(completed / tasks.length * 100)}% complete · {tasks.length - completed} remaining</p>
            <Progress value={completed / tasks.length * 100} label="Task completion" />
            <a className={`dashboard-badge ${overdue ? "badge-blush" : "badge-sage"} dashboard-overdue-link`} href="#tasks">{overdue ? `${overdue} overdue ${overdue === 1 ? "task" : "tasks"}` : "All caught up on overdue tasks"}<DashboardIcon name="arrow" size={14} /></a>
            <p className="dashboard-metric-foot">One step closer to your celebration.</p>
          </section>
          <section className="dashboard-card dashboard-metric" aria-labelledby="budget-metric-heading">
            <div className="dashboard-metric-header"><p className="dashboard-eyebrow" id="budget-metric-heading">Committed budget</p><span className="dashboard-metric-icon metric-gold"><DashboardIcon name="wallet" /></span></div>
            <p className="dashboard-metric-value metric-money">{currency(committed)}</p><p className="dashboard-small">of {currency(budget.total)} total · 80%</p>
            <Progress value={committed / budget.total * 100} label="Committed share of budget" />
            <p className="dashboard-buffer"><span>Remaining budget</span><strong>{currency(budget.total - committed)}</strong></p><p className="dashboard-metric-foot">Room for the finishing touches.</p>
          </section>
          <section className="dashboard-card dashboard-metric dashboard-next-event" aria-labelledby="next-event-heading">
            <div className="dashboard-metric-header"><p className="dashboard-eyebrow" id="next-event-heading">Next celebration</p><span className="dashboard-badge badge-gold">In {daysUntil(nextEvent.date)} days</span></div>
            <h2>{nextEvent.name}</h2><p><DashboardIcon name="clock" size={16} />{dateLabel(nextEvent.date)} · {timeLabel(nextEvent.time)}</p><p><DashboardIcon name="location" size={16} />{nextEvent.venue}</p>
            <button type="button" className="dashboard-next-link" onClick={() => openEvent(nextEvent)}>View event details <DashboardIcon name="arrow" size={16} /></button>
          </section>
        </div>

        <div className="dashboard-columns">
          <div className="dashboard-left-column">
            <section id="celebrations" className="dashboard-card dashboard-section" aria-labelledby="celebrations-heading">
              <div className="dashboard-section-header"><div><p className="dashboard-eyebrow">Rituals &amp; gatherings</p><h2 id="celebrations-heading">Upcoming celebrations</h2></div><span className="dashboard-badge badge-neutral">{events.length} events scheduled</span></div>
              <div className="dashboard-events">{sortedEvents.map(event => {
                const extra = families.filter(family => family.eventId === event.id);
                return <button type="button" key={event.id} className={`dashboard-event ${event.id === "wedding" ? "is-wedding" : ""}`} onClick={() => openEvent(event)} aria-label={`View ${event.name} details`}>
                  <span className="dashboard-date-tile"><small>{dateLabel(event.date, { month: "short" })}</small><strong>{dateLabel(event.date, { day: "numeric" })}</strong></span>
                  <span className="dashboard-event-copy"><span className="dashboard-event-title">{event.name}{event.id === "wedding" && <span className="dashboard-badge badge-gold">The big day</span>}</span><span className="dashboard-event-meta">{timeLabel(event.time)} <span aria-hidden="true">·</span> {event.venue}</span></span>
                  <span className="dashboard-event-guests"><small>Invited</small><strong>{event.invitedPeople + extra.reduce((total, family) => total + family.people, 0)} people</strong><span>{event.invitedFamilies + extra.length} families</span></span><DashboardIcon name="chevron" size={16} />
                </button>;
              })}</div>
            </section>

            <section id="tasks" className="dashboard-card dashboard-section" aria-labelledby="tasks-heading">
              <div className="dashboard-section-header"><div><p className="dashboard-eyebrow">A little attention, a big difference</p><h2 id="tasks-heading">Priority tasks</h2></div><span className="dashboard-small">Check to complete</span></div>
              <div className="dashboard-task-list">{taskList.map(task => <label key={task.id} className={`dashboard-task ${task.completed ? "is-complete" : ""}`}>
                <input type="checkbox" checked={task.completed} onChange={() => {
                  setTasks(current => current.map(item => item.id === task.id ? { ...item, completed: !item.completed } : item));
                  setAnnouncement(`${task.title} marked ${task.completed ? "incomplete" : "complete"}.`);
                }} />
                <span><span className={`dashboard-badge ${task.completed ? "badge-sage" : task.due < previewDate ? "badge-blush" : "badge-neutral"}`}>{task.completed ? "Completed" : `${task.due < previewDate ? "Overdue ·" : "Due"} ${dateLabel(task.due)}`}</span><strong>{task.title}</strong><small>{task.assignee} <span aria-hidden="true">·</span> Due {dateLabel(task.due)}</small></span>
              </label>)}</div>
              <button className="dashboard-text-button" type="button" onClick={() => setShowAllTasks(current => !current)} aria-expanded={showAllTasks}>{showAllTasks ? "Show priority tasks" : `View all ${tasks.length} tasks`}<DashboardIcon name="arrow" size={16} /></button>
            </section>
          </div>

          <div className="dashboard-right-column">
            <section id="budget" className="dashboard-card dashboard-section" aria-labelledby="budget-heading">
              <div className="dashboard-section-header"><div><p className="dashboard-eyebrow">Thoughtfully planned</p><h2 id="budget-heading">Budget allocation</h2></div></div>
              <p className="dashboard-budget-total">{currency(budget.total)} <span>total budget</span></p>
              <dl className="dashboard-budget-summary"><div><dt>Committed</dt><dd>{currency(committed)}</dd><small>80% of total budget</small></div><div><dt>Already paid</dt><dd className="text-sage">{currency(budget.paid)}</dd><small>66.7% of committed costs</small></div><div><dt>Outstanding</dt><dd className="text-gold">{currency(committed - budget.paid)}</dd><small>Committed, still to pay</small></div><div><dt>Remaining budget</dt><dd className="text-plum">{currency(budget.total - committed)}</dd><small>Available to allocate</small></div></dl>
              <h3 className="dashboard-eyebrow dashboard-category-heading">Committed costs by category</h3>
              <div className="dashboard-categories">{budget.categories.map(category => <div key={category.name} className="dashboard-category"><div><span>{category.name}</span><strong>{currency(category.amount)} <small>{(category.amount / committed * 100).toFixed(1)}%</small></strong></div><div className="dashboard-category-bar" aria-hidden="true"><span style={{ width: `${category.amount / committed * 100}%`, background: category.color }} /></div></div>)}</div>
              <p className="dashboard-small dashboard-budget-caption">Percentages show each category’s share of committed costs.</p>
              <div id="payments" className="dashboard-payments"><h3 className="dashboard-eyebrow">Upcoming vendor payments</h3>{upcomingPayments.map(payment => <div key={payment.vendor} className="dashboard-payment"><span className="dashboard-payment-icon"><DashboardIcon name="vendor" size={18} /></span><div><strong>{payment.vendor}</strong><small>{payment.category} · {dateLabel(payment.date)}</small></div><span>{currency(payment.amount)}</span></div>)}<p className="dashboard-small">Next payments: {currency(upcomingPayments.reduce((total, payment) => total + payment.amount, 0))} of {currency(committed - budget.paid)} outstanding.</p></div>
            </section>
            <aside className="dashboard-gentle-note"><DashboardIcon name="sparkle" size={22} /><div><h3>Coming together</h3><p>Every little decision is making room for something wonderful. Take it one celebration at a time.</p></div></aside>
          </div>
        </div>
        <footer className="dashboard-footer"><span>Made for the moments that matter.</span><span>MakeMyMarriage · Owner preview</span></footer>
        <p className="sr-only" role="status">{announcement}</p>
      </main>
    </div>

    <dialog ref={mobileMenu} className="dashboard-mobile-drawer" aria-label="Planning navigation" onClick={event => { if (event.target === event.currentTarget) mobileMenu.current?.close(); }}><div className="dashboard-drawer-header"><DashboardBrand /><button className="dashboard-icon-button" type="button" onClick={() => mobileMenu.current?.close()} aria-label="Close navigation"><DashboardIcon name="close" /></button></div><Navigation onNavigate={() => mobileMenu.current?.close()} /><SignOut className="dashboard-sign-out" buttonClassName="dashboard-button" /></dialog>

    <dialog ref={actionDialog} className="dashboard-dialog" aria-labelledby="dashboard-dialog-heading" onClose={() => setAction(null)} onClick={event => { if (event.target === event.currentTarget) actionDialog.current?.close(); }}>
      <div className="dashboard-dialog-header"><div><p className="dashboard-eyebrow">Owner dashboard preview</p><h2 id="dashboard-dialog-heading">{actionTitle}</h2></div><button type="button" className="dashboard-icon-button" aria-label="Close dialog" onClick={() => actionDialog.current?.close()}><DashboardIcon name="close" /></button></div>
      {(action === "family" || action === "event") && <p className="dashboard-dialog-note">Try the planning flow with sample data. Your changes stay on this page and reset on reload.</p>}
      {action === "family" && <form onSubmit={addFamily} className="dashboard-form"><label>Family name<input name="name" required maxLength={100} placeholder="e.g. The Shah family" autoComplete="off" /></label><label>People invited<input name="people" type="number" min={1} max={500} required defaultValue={4} /></label><label>Invited event<select name="eventId" defaultValue={rsvpEventId}>{sortedEvents.map(event => <option key={event.id} value={event.id}>{event.name}</option>)}</select></label><p className="dashboard-small">The family will appear as pending in this event’s RSVP summary.</p><button type="submit" className="dashboard-button is-primary">Add sample family<DashboardIcon name="plus" size={17} /></button></form>}
      {action === "event" && <form onSubmit={addEvent} className="dashboard-form"><label>Event name<input name="name" required maxLength={100} placeholder="e.g. Family welcome dinner" autoComplete="off" /></label><div className="dashboard-form-row"><label>Date<input name="date" type="date" min={previewDate} max="2099-12-31" required defaultValue="2027-02-10" /></label><label>Time<input name="time" type="time" required defaultValue="18:00" /></label></div><label>Venue<input name="venue" required maxLength={160} placeholder="e.g. Garden Pavilion, Mumbai" autoComplete="off" /></label><button type="submit" className="dashboard-button is-primary">Add sample event<DashboardIcon name="plus" size={17} /></button></form>}
      {action === "invitation" && <div className="dashboard-invitation-note"><span className="dashboard-invitation-icon"><DashboardIcon name="mail" size={32} /></span><h3>An invitation to your celebration.</h3><p>Personalised English Kankotri invitations will be created from your events and family guest list. Invitation creation and PDF downloads are coming in a later milestone.</p><button type="button" className="dashboard-button" onClick={() => actionDialog.current?.close()}>Back to overview</button></div>}
      {action === "details" && detailEvent && <div className="dashboard-event-detail"><p><DashboardIcon name="calendar" />{dateLabel(detailEvent.date, { day: "numeric", month: "long", year: "numeric" })} · {timeLabel(detailEvent.time)}</p><p><DashboardIcon name="location" />{detailEvent.venue}</p><dl><div><dt>Invited families</dt><dd>{detailEvent.invitedFamilies + families.filter(family => family.eventId === detailEvent.id).length}</dd></div><div><dt>Invited people</dt><dd>{detailEvent.invitedPeople + families.filter(family => family.eventId === detailEvent.id).reduce((total, family) => total + family.people, 0)}</dd></div><div><dt>Confirmed people</dt><dd>{detailEvent.confirmedPeople}</dd></div></dl><p className="dashboard-dialog-note">Fictional event details for this design preview.</p></div>}
    </dialog>
  </div>;
}
