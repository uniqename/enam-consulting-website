import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, ShieldCheck, Smartphone, LineChart, HelpCircle, Bot,
  ArrowRight, ChevronLeft, ChevronRight, Clock, Calendar,
  Users, Download, Mail, Video, Plus, X,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MeetingTypeConfig {
  key: string;
  title: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
  bgClass: string;
  subject: string;
  whatToBring: string[];
  fee: string | null;
  feeNote: string | null;
}

type Step = 'type' | 'schedule' | 'details' | 'confirmed';
interface FormState { name: string; email: string; company: string; message: string }

// ─── Config ───────────────────────────────────────────────────────────────────

const MEETING_TYPES: MeetingTypeConfig[] = [
  {
    key: 'strategy',
    title: 'Enterprise GRC Strategy',
    tagline: 'Risk, compliance & controls',
    description: "Deep dive into your risk architecture. We'll map a migration path from manual processes to automated GRC workflows.",
    icon: <LineChart className="w-5 h-5" />,
    colorClass: 'text-blue-600',
    bgClass: 'bg-blue-50 border-blue-200',
    subject: 'Enterprise GRC Strategy Session',
    whatToBring: ['Current risk register or audit findings', 'Compliance framework in use (SOX, ISO, etc.)', 'Org chart / team structure', 'Any pending audit deadlines'],
    fee: '$350',
    feeNote: 'Credited toward your engagement if you move forward.',
  },
  {
    key: 'mvp',
    title: 'MVP Development Discovery',
    tagline: 'From idea to App Store',
    description: "Technical feasibility for your mobile app. We'll cover architecture, timeline, and a realistic budget range.",
    icon: <Smartphone className="w-5 h-5" />,
    colorClass: 'text-emerald-600',
    bgClass: 'bg-emerald-50 border-emerald-200',
    subject: 'MVP Development Discovery Call',
    whatToBring: ['Product brief or 1-page concept doc', 'Rough budget range', 'Target launch date', 'Competing apps you admire'],
    fee: '$500',
    feeNote: 'Credited toward your project if you move forward.',
  },
  {
    key: 'retainer',
    title: 'Fractional Product Leadership',
    tagline: 'Part-time CPO / PM support',
    description: "Ongoing PM support for startups. I'll own the backlog, run sprints, and keep engineering and stakeholders aligned.",
    icon: <ShieldCheck className="w-5 h-5" />,
    colorClass: 'text-purple-600',
    bgClass: 'bg-purple-50 border-purple-200',
    subject: 'Fractional Product Leadership Inquiry',
    whatToBring: ['Current team structure', 'Sprint cadence or delivery process', 'Biggest product bottleneck right now', 'Recent roadmap or backlog (if any)'],
    fee: null,
    feeNote: 'Free discovery call. First month paid upfront before work begins.',
  },
  {
    key: 'ai',
    title: 'AI Transformation Advisory',
    tagline: 'AI readiness, build & deployment',
    description: "I'll assess where AI fits in your business, identify the highest-ROI use cases, and build or guide the solution.",
    icon: <Bot className="w-5 h-5" />,
    colorClass: 'text-amber-600',
    bgClass: 'bg-amber-50 border-amber-200',
    subject: 'AI Transformation Advisory Session',
    whatToBring: ["Overview of your current operations & tools", "Biggest time/cost bottlenecks in your workflow", "Any AI tools you've tried or explored", 'Budget range or engagement tier interest'],
    fee: '$250',
    feeNote: 'Credited toward your audit or build engagement if you move forward.',
  },
  {
    key: 'intro',
    title: 'General Inquiry',
    tagline: "Not sure where to start?",
    description: "Not sure which service fits? Let's chat and see if we're the right fit for your project.",
    icon: <HelpCircle className="w-5 h-5" />,
    colorClass: 'text-stone-600',
    bgClass: 'bg-stone-50 border-stone-200',
    subject: 'General Inquiry',
    whatToBring: ['A quick summary of your challenge', 'Any relevant context about your team or product'],
    fee: null,
    feeNote: 'Complimentary — no commitment required.',
  },
];

const ALL_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const DAY_LABELS = ['Mon','Tue','Wed','Thu','Fri'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getMondayOfWeek(offset: number): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dow = today.getDay();
  const daysToMon = dow === 0 ? 1 : dow === 6 ? 2 : -(dow - 1);
  const monday = new Date(today);
  monday.setDate(today.getDate() + daysToMon + offset * 7);
  return monday;
}

function getWeekDays(offset: number): Date[] {
  const monday = getMondayOfWeek(offset);
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function getAvailableSlots(date: Date): string[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) return [];
  const seed = date.getDate() * 13 + (date.getMonth() + 1) * 7 + (date.getFullYear() % 100) * 3;
  const now = new Date();
  return ALL_SLOTS.filter((slot, i) => {
    if ((seed + i * 17) % 10 <= 3) return false;
    if (date.toDateString() === now.toDateString()) {
      const [t, p] = slot.split(' ');
      const h = parseInt(t) + (p === 'PM' && parseInt(t) !== 12 ? 12 : 0);
      if (h <= now.getHours() + 1) return false;
    }
    return true;
  });
}

function addOneHour(slot: string): string {
  const [time, period] = slot.split(' ');
  const [h] = time.split(':').map(Number);
  let newH = h + 1;
  let newP = period;
  if (h === 11 && period === 'AM') { newH = 12; newP = 'PM'; }
  else if (h === 12 && period === 'PM') { newH = 1; newP = 'PM'; }
  return `${newH}:00 ${newP}`;
}

function formatTimeShort(slot: string): string {
  return slot.replace(':00', '').toLowerCase();
}

function buildMeetingTitle(date: Date, slot: string, company: string): string {
  const endSlot = addOneHour(slot);
  const label = company.trim() || 'Guest';
  const dateStr = `${DAY_SHORT[date.getDay()]} ${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  return `Enam Egyir and ${label} @ ${dateStr} ${formatTimeShort(slot)} EDT to ${formatTimeShort(endSlot)} EDT`;
}

function generateICS(params: {
  date: Date; slot: string; title: string;
  name: string; email: string; guests: string[];
  description: string;
}): string {
  const { date, slot, title, name, email, guests, description } = params;
  const [time, period] = slot.split(' ');
  const [h] = time.split(':').map(Number);
  const hour24 = period === 'PM' && h !== 12 ? h + 12 : period === 'AM' && h === 12 ? 0 : h;
  const endHour24 = hour24 + 1;

  const pad = (n: number) => String(n).padStart(2, '0');
  const y = date.getFullYear();
  const mo = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const dtstart = `${y}${mo}${d}T${pad(hour24)}0000`;
  const dtend   = `${y}${mo}${d}T${pad(endHour24)}0000`;
  const dtstamp = new Date().toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z';
  const uid = `${Date.now()}-enam@doxaandco.co`;

  const attendeeLines = [
    `ATTENDEE;CN=${name};RSVP=TRUE;PARTSTAT=NEEDS-ACTION:MAILTO:${email}`,
    ...guests.filter(Boolean).map(g => `ATTENDEE;RSVP=TRUE;PARTSTAT=NEEDS-ACTION:MAILTO:${g.trim()}`),
  ].join('\r\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Doxa and Co//EN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART;TZID=America/New_York:${dtstart}`,
    `DTEND;TZID=America/New_York:${dtend}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    'LOCATION:Google Meet (link shared before the call)',
    'ORGANIZER;CN=Enam Egyir:MAILTO:ename@doxaandco.co',
    attendeeLines,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Meeting in 15 minutes',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

function downloadICS(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

// ─── Component ────────────────────────────────────────────────────────────────

const Booking = () => {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<Step>('type');
  const [selectedType, setSelectedType] = useState(MEETING_TYPES[0]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({ name: '', email: '', company: '', message: '' });
  const [guests, setGuests] = useState<string[]>(['']);
  const [errors, setErrors] = useState<Partial<FormState>>({});

  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam) {
      const match = MEETING_TYPES.find(m => m.key === typeParam);
      if (match) { setSelectedType(match); setStep('schedule'); }
    }
  }, [searchParams]);

  const weekDays = useMemo(() => getWeekDays(weekOffset), [weekOffset]);
  const availableSlots = useMemo(() => selectedDate ? getAvailableSlots(selectedDate) : [], [selectedDate]);
  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);
  const isPastWeek = weekDays[4] < today;

  const meetingTitle = useMemo(() =>
    selectedDate && selectedSlot ? buildMeetingTitle(selectedDate, selectedSlot, form.company || form.name) : '',
    [selectedDate, selectedSlot, form.company, form.name]
  );

  const validate = () => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.message.trim()) e.message = 'Please add a brief agenda';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleConfirm = () => {
    if (!validate() || !selectedDate || !selectedSlot) return;
    const validGuests = guests.filter(g => g.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(g.trim()));
    const title = meetingTitle;
    const endSlot = addOneHour(selectedSlot);
    const desc = [
      `Meeting: ${selectedType.title}`,
      `Date: ${DAY_SHORT[selectedDate.getDay()]} ${MONTH_NAMES[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`,
      `Time: ${selectedSlot} – ${endSlot} EDT`,
      ``, `Agenda:`, form.message, ``,
      `Attendee: ${form.name} <${form.email}>`,
      form.company ? `Company: ${form.company}` : '',
      validGuests.length ? `Additional guests: ${validGuests.join(', ')}` : '',
      ``, `A Google Meet link will be shared before the call.`,
    ].filter(Boolean).join('\n');

    const ics = generateICS({ date: selectedDate, slot: selectedSlot, title, name: form.name, email: form.email, guests: validGuests, description: desc });
    downloadICS(ics, 'meeting-enam-egyir.ics');

    const allRecipients = ['ename@doxaandco.co', ...validGuests];
    const [to, ...cc] = allRecipients;
    const ccParam = cc.length ? `&cc=${encodeURIComponent(cc.join(','))}` : '';
    const feeSection = selectedType.fee
      ? `\n\nSession Fee: ${selectedType.fee}\n${selectedType.feeNote}\nPayment details will be confirmed by Enam before the call.`
      : '';
    const body = `Hi Enam,\n\nI'm reaching out regarding: ${selectedType.title}\n\nDate/Time: ${DAY_SHORT[selectedDate.getDay()]} ${MONTH_NAMES[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()} at ${selectedSlot} EDT\n\nAgenda:\n${form.message}${feeSection}\n\n---\nName: ${form.name}${form.company ? `\nCompany: ${form.company}` : ''}\nEmail: ${form.email}${validGuests.length ? `\nAdditional guests: ${validGuests.join(', ')}` : ''}\n\n(Calendar invite attached)`;
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(title)}${ccParam}&body=${encodeURIComponent(body)}`;
    setStep('confirmed');
  };

  const addGuest = () => setGuests(g => [...g, '']);
  const updateGuest = (i: number, v: string) => setGuests(g => g.map((x, j) => j === i ? v : x));
  const removeGuest = (i: number) => setGuests(g => g.filter((_, j) => j !== i));

  const steps: Step[] = ['type', 'schedule', 'details', 'confirmed'];
  const stepIdx = steps.indexOf(step);

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16 px-4 lg:px-8">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-10">
          <h1 className="text-4xl lg:text-5xl font-bold text-stone-900 mb-3">Book a Meeting</h1>
          <p className="text-stone-500 text-lg">60-minute sessions · Google Meet · EDT</p>
        </div>

        {step !== 'confirmed' && (
          <div className="flex items-center justify-center gap-2 mb-10">
            {(['type','schedule','details'] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${stepIdx >= i ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-400'}`}>
                  <span>{i + 1}</span>
                  <span className="hidden sm:inline">{['Type','Schedule','Details'][i]}</span>
                </div>
                {i < 2 && <div className={`h-px w-8 transition-all ${stepIdx > i ? 'bg-stone-900' : 'bg-stone-300'}`} />}
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">

          {step === 'type' && (
            <motion.div key="type" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {MEETING_TYPES.map(m => (
                  <button type="button" key={m.key}
                    onClick={() => { setSelectedType(m); setStep('schedule'); }}
                    className={`text-left p-6 rounded-2xl border-2 transition-all duration-150 hover:shadow-md group ${selectedType.key === m.key ? `${m.bgClass} border-current` : 'bg-white border-stone-100 hover:border-stone-300'}`}
                  >
                    <div className={`mb-3 ${m.colorClass}`}>{m.icon}</div>
                    <div className="font-bold text-stone-900 mb-0.5">{m.title}</div>
                    <div className="text-xs text-stone-400 mb-3">{m.tagline}</div>
                    <div className="mb-3">
                      {m.fee
                        ? <span className="inline-block text-xs font-bold px-2 py-0.5 rounded-full bg-stone-900 text-white">Session fee applies</span>
                        : <span className="inline-block text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Free</span>
                      }
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 group-hover:text-emerald-600 transition-colors">
                      Select <ArrowRight size={12} />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'schedule' && (
            <motion.div key="schedule" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-3 space-y-4">
                  <button type="button" onClick={() => setStep('type')} className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 transition-colors">
                    <ChevronLeft size={15} /> Back
                  </button>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${selectedType.bgClass} ${selectedType.colorClass}`}>
                    {selectedType.icon} {selectedType.title}
                  </div>
                  <div className="space-y-2 text-sm text-stone-500">
                    <div className="flex items-center gap-2"><Clock size={14} /> 60 minutes</div>
                    <div className="flex items-center gap-2"><Video size={14} /> Google Meet</div>
                    <div className="flex items-center gap-2"><Calendar size={14} /> Eastern Time (EDT)</div>
                  </div>
                  {selectedType.fee && (
                    <div className="rounded-xl p-3 text-xs leading-relaxed bg-stone-900 text-white">
                      <p className="font-bold mb-0.5">Session fee applies</p>
                      <p className="text-stone-300">Fee details will be shared in your confirmation email before the call.</p>
                    </div>
                  )}
                  {!selectedType.fee && selectedType.feeNote && (
                    <div className="rounded-xl p-3 text-xs leading-relaxed bg-emerald-50 text-emerald-800 border border-emerald-100">
                      <p className="font-medium">{selectedType.feeNote}</p>
                    </div>
                  )}
                  <div className="bg-white rounded-xl border border-stone-100 p-4 space-y-2">
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">What to bring</p>
                    <ul className="space-y-1.5">
                      {selectedType.whatToBring.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-stone-600">
                          <CheckCircle2 size={12} className="text-emerald-500 shrink-0 mt-0.5" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-100 shadow-sm p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <button type="button" aria-label="Previous week" onClick={() => { setWeekOffset(o => o - 1); setSelectedDate(null); setSelectedSlot(null); }}
                      disabled={isPastWeek || weekOffset === 0}
                      className="p-1.5 rounded-lg hover:bg-stone-100 disabled:opacity-30 transition-colors">
                      <ChevronLeft size={16} />
                    </button>
                    <span className="font-semibold text-stone-800 text-sm">{MONTH_NAMES[weekDays[0].getMonth()]} {weekDays[0].getFullYear()}</span>
                    <button type="button" aria-label="Next week" onClick={() => { setWeekOffset(o => o + 1); setSelectedDate(null); setSelectedSlot(null); }}
                      disabled={weekOffset >= 3}
                      className="p-1.5 rounded-lg hover:bg-stone-100 disabled:opacity-30 transition-colors">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-1 text-center">
                    {DAY_LABELS.map(d => <div key={d} className="text-xs font-medium text-stone-400 py-1">{d}</div>)}
                  </div>
                  <div className="grid grid-cols-5 gap-1">
                    {weekDays.map((day, i) => {
                      const isPast = day < today;
                      const hasSlots = getAvailableSlots(day).length > 0;
                      const isSelected = selectedDate?.toDateString() === day.toDateString();
                      return (
                        <button type="button" key={i} disabled={isPast || !hasSlots}
                          onClick={() => { setSelectedDate(day); setSelectedSlot(null); }}
                          className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-semibold transition-all
                            ${isSelected ? 'bg-stone-900 text-white shadow-md' : isPast || !hasSlots ? 'text-stone-300 cursor-not-allowed' : 'hover:bg-emerald-50 hover:text-emerald-700 text-stone-700 cursor-pointer'}`}
                        >
                          <span>{day.getDate()}</span>
                          {!isPast && hasSlots && !isSelected && <span className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5" />}
                        </button>
                      );
                    })}
                  </div>
                  {!selectedDate && <p className="text-xs text-center text-stone-400 pt-2">← Select a date to see available times</p>}
                </div>

                <div className="lg:col-span-4">
                  <AnimatePresence mode="wait">
                    {selectedDate && (
                      <motion.div key={selectedDate.toDateString()} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 space-y-4">
                        <p className="font-semibold text-stone-800 text-sm">{DAY_SHORT[selectedDate.getDay()]}, {MONTH_NAMES[selectedDate.getMonth()]} {selectedDate.getDate()}</p>
                        <p className="text-xs text-stone-400">Eastern Time (EDT) · 60 min</p>
                        <div className="space-y-2">
                          {availableSlots.length === 0 ? (
                            <p className="text-sm text-stone-400 text-center py-4">No availability — try another day</p>
                          ) : availableSlots.map(slot => (
                            <button type="button" key={slot} onClick={() => setSelectedSlot(slot)}
                              className={`w-full py-2.5 px-4 rounded-xl border-2 text-sm font-semibold transition-all ${selectedSlot === slot ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-200 text-stone-700 hover:border-emerald-500 hover:text-emerald-700'}`}>
                              {slot} – {addOneHour(slot)} EDT
                            </button>
                          ))}
                        </div>
                        {selectedSlot && (
                          <button type="button" onClick={() => setStep('details')}
                            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-all mt-2">
                            Continue <ArrowRight size={16} />
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'details' && selectedDate && selectedSlot && (
            <motion.div key="details" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-4">
                  <button type="button" onClick={() => setStep('schedule')} className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 transition-colors">
                    <ChevronLeft size={15} /> Back
                  </button>
                  <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 space-y-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${selectedType.bgClass} ${selectedType.colorClass}`}>
                      {selectedType.icon} {selectedType.title}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-stone-600"><Calendar size={14} className="text-stone-400" /><span className="font-medium">{DAY_SHORT[selectedDate.getDay()]}, {MONTH_NAMES[selectedDate.getMonth()]} {selectedDate.getDate()}, {selectedDate.getFullYear()}</span></div>
                      <div className="flex items-center gap-2 text-stone-600"><Clock size={14} className="text-stone-400" /><span className="font-medium">{selectedSlot} – {addOneHour(selectedSlot)} EDT</span></div>
                      <div className="flex items-center gap-2 text-stone-600"><Video size={14} className="text-stone-400" /><span>Google Meet</span></div>
                    </div>
                    <div className="border-t border-stone-100 pt-4 space-y-1.5">
                      <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">What to bring</p>
                      {selectedType.whatToBring.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-stone-500">
                          <CheckCircle2 size={11} className="text-emerald-500 shrink-0 mt-0.5" />{item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8 bg-white rounded-3xl shadow-xl border border-stone-100 p-8 space-y-5">
                  <h2 className="text-xl font-bold text-stone-900">Your details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(['name','email'] as const).map(id => (
                      <div key={id}>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5" htmlFor={id}>{id === 'name' ? 'Full Name' : 'Email'} *</label>
                        <input id={id} type={id === 'email' ? 'email' : 'text'}
                          placeholder={id === 'name' ? 'Jane Smith' : 'jane@company.com'}
                          value={form[id]} onChange={e => setForm(f => ({ ...f, [id]: e.target.value }))}
                          className={`w-full px-4 py-3 rounded-xl border text-stone-800 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors[id] ? 'border-red-400 bg-red-50' : 'border-stone-200'}`}
                        />
                        {errors[id] && <p className="mt-1 text-xs text-red-500">{errors[id]}</p>}
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5" htmlFor="company">Company / Organization</label>
                    <input id="company" type="text" placeholder="Acme Corp (optional)" value={form.company}
                      onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-800 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-sm font-medium text-stone-700"><Users size={13} className="inline mr-1.5 text-stone-400" />Add Guests</label>
                      <button type="button" onClick={addGuest} className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-medium"><Plus size={12} /> Add another</button>
                    </div>
                    <div className="space-y-2">
                      {guests.map((g, i) => (
                        <div key={i} className="flex gap-2">
                          <input type="email" placeholder={`guest${i + 1}@company.com (optional)`} value={g}
                            onChange={e => updateGuest(i, e.target.value)}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-800 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                          {guests.length > 1 && <button type="button" aria-label="Remove guest" onClick={() => removeGuest(i)} className="p-2 text-stone-400 hover:text-red-500 transition-colors"><X size={14} /></button>}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5" htmlFor="message">Agenda / Questions *</label>
                    <textarea id="message" rows={4}
                      placeholder="What's on your agenda? Any specific questions or context that would help me prepare..."
                      value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-xl border text-stone-800 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none ${errors.message ? 'border-red-400 bg-red-50' : 'border-stone-200'}`}
                    />
                    {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                  </div>
                  <button type="button" onClick={handleConfirm}
                    className="w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-emerald-700 text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.01]">
                    <Calendar size={16} /> Confirm Meeting
                  </button>
                  <p className="text-xs text-stone-400 text-center">Downloads a calendar invite (.ics) and opens your email app with the meeting details.</p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'confirmed' && selectedDate && selectedSlot && (
            <motion.div key="confirmed" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border border-stone-100 p-12 text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={36} className="text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-stone-900 mb-2">You're all set!</h2>
                <p className="text-stone-500">A calendar invite has been downloaded and your email app should have opened.</p>
              </div>
              {selectedType.fee && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 text-sm text-amber-900">
                  <p className="font-bold mb-0.5">Session fee reminder</p>
                  <p>Enam will confirm the session fee ({selectedType.fee}) and payment details by email before the call. {selectedType.feeNote}</p>
                </div>
              )}
              <div className="bg-stone-50 rounded-2xl p-5 text-left space-y-3">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Meeting Summary</p>
                <p className="font-semibold text-stone-800 text-sm leading-relaxed">{meetingTitle}</p>
                <div className="space-y-1.5 text-sm text-stone-600">
                  <div className="flex items-center gap-2"><Video size={13} className="text-stone-400" /> Google Meet (link sent separately)</div>
                  <div className="flex items-center gap-2"><Clock size={13} className="text-stone-400" /> 60 minutes · {selectedType.title}</div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button type="button"
                  onClick={() => {
                    if (!selectedDate || !selectedSlot) return;
                    const ics = generateICS({ date: selectedDate, slot: selectedSlot, title: meetingTitle, name: form.name, email: form.email, guests: guests.filter(g => g.trim()), description: `Meeting: ${selectedType.title}\nAgenda: ${form.message}` });
                    downloadICS(ics, 'meeting-enam-egyir.ics');
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-stone-900 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-all">
                  <Download size={15} /> Download .ics Again
                </button>
                <a href="mailto:ename@doxaandco.co"
                  className="flex-1 flex items-center justify-center gap-2 border-2 border-stone-200 hover:border-stone-900 text-stone-700 font-semibold py-3 rounded-xl transition-all">
                  <Mail size={15} /> Email Directly
                </a>
              </div>
              <button type="button" onClick={() => { setStep('type'); setSelectedDate(null); setSelectedSlot(null); setForm({ name:'', email:'', company:'', message:'' }); setGuests(['']); }}
                className="text-sm text-stone-400 hover:text-stone-700 underline underline-offset-2 transition-colors">
                Book another meeting
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default Booking;
