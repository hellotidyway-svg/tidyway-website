'use client';

import { useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

type TabId = 'standard' | 'deep' | 'moveinout';
type Tier  = 'standard' | 'deep' | 'moveinout';

interface Task { text: string; tier: Tier }
interface Room { title: string; icon: string; tasks: Task[] }

// ─── Tab metadata ─────────────────────────────────────────────────────────────

const TABS: { id: TabId; label: string; description: string }[] = [
  {
    id: 'standard',
    label: 'Standard',
    description: 'Included with every one-time or recurring booking.',
  },
  {
    id: 'deep',
    label: 'Deep Clean',
    description: 'All standard tasks, plus baseboards, window frames, upholstery, and more.',
  },
  {
    id: 'moveinout',
    label: 'Move-In / Move-Out',
    description: 'Our most thorough clean — deep tasks plus inside appliances, cupboards, and walls.',
  },
];

// Which tabs each tier is visible in
const TIER_VISIBILITY: Record<Tier, TabId[]> = {
  standard:  ['standard', 'deep', 'moveinout'],
  deep:      ['deep', 'moveinout'],
  moveinout: ['moveinout'],
};

// ─── Checklist data ───────────────────────────────────────────────────────────

const ROOMS: Room[] = [
  {
    title: 'Bedrooms & Living Areas',
    icon: '🛏',
    tasks: [
      { text: 'Dust and wipe all accessible surfaces',    tier: 'standard'  },
      { text: 'Vacuum or sweep all floors',                tier: 'standard'  },
      { text: 'Empty waste bins',                          tier: 'standard'  },
      { text: 'Wipe light switches and door handles',      tier: 'standard'  },
      { text: 'Straighten and tidy the space',             tier: 'standard'  },
      { text: 'Dust ceiling fans and light fixtures',      tier: 'standard'  },
      { text: 'Clean mirrors and glass surfaces',          tier: 'standard'  },
      { text: 'Wipe windowsills',                          tier: 'standard'  },
      { text: 'Wipe down baseboards',                      tier: 'deep'      },
      { text: 'Clean exterior of all furniture',           tier: 'deep'      },
      { text: 'Wipe window frames and tracks',             tier: 'deep'      },
      { text: 'Vacuum upholstered furniture',              tier: 'deep'      },
      { text: 'Dust and wipe wall art and decor',          tier: 'deep'      },
      { text: 'Wipe interior of closets and shelving',     tier: 'moveinout' },
      { text: 'Clean inside all cupboards and drawers',    tier: 'moveinout' },
      { text: 'Wash walls and spot-clean scuffs',          tier: 'moveinout' },
    ],
  },
  {
    title: 'Kitchen',
    icon: '🍳',
    tasks: [
      { text: 'Wipe countertops and backsplash',           tier: 'standard'  },
      { text: 'Clean stovetop surface (exterior)',         tier: 'standard'  },
      { text: 'Wipe exterior of appliances',               tier: 'standard'  },
      { text: 'Clean sink and faucet fixtures',            tier: 'standard'  },
      { text: 'Sweep and mop floors',                      tier: 'standard'  },
      { text: 'Wipe cabinet door exteriors',               tier: 'standard'  },
      { text: 'Empty and reline waste bins',               tier: 'standard'  },
      { text: 'Degrease range hood and filters',           tier: 'deep'      },
      { text: 'Clean inside microwave',                    tier: 'deep'      },
      { text: 'Sanitize fridge exterior',                  tier: 'deep'      },
      { text: 'Scrub sink and remove buildup',             tier: 'deep'      },
      { text: 'Clean inside oven',                         tier: 'moveinout' },
      { text: 'Clean inside fridge',                       tier: 'moveinout' },
      { text: 'Wipe inside all cabinets and drawers',      tier: 'moveinout' },
      { text: 'Sanitize all surfaces',                     tier: 'moveinout' },
    ],
  },
  {
    title: 'Bathrooms',
    icon: '🚿',
    tasks: [
      { text: 'Scrub and sanitize toilet',                 tier: 'standard'  },
      { text: 'Clean and shine sink and faucet',           tier: 'standard'  },
      { text: 'Wipe vanity and countertop',                tier: 'standard'  },
      { text: 'Scrub shower and/or tub',                   tier: 'standard'  },
      { text: 'Clean mirrors',                             tier: 'standard'  },
      { text: 'Sweep and mop floors',                      tier: 'standard'  },
      { text: 'Empty waste bins',                          tier: 'standard'  },
      { text: 'Wipe light switches and door handles',      tier: 'standard'  },
      { text: 'Descale showerhead and faucets',            tier: 'deep'      },
      { text: 'Scrub grout lines in tile',                 tier: 'deep'      },
      { text: 'Wipe baseboards and door frames',           tier: 'deep'      },
      { text: 'Clean exhaust fan cover',                   tier: 'deep'      },
      { text: 'Wipe inside vanity drawers and cabinets',   tier: 'moveinout' },
      { text: 'Deep scrub all tile top to bottom',         tier: 'moveinout' },
      { text: 'Sanitize all contact surfaces',             tier: 'moveinout' },
    ],
  },
  {
    title: 'Hallways, Stairs & Laundry',
    icon: '🏠',
    tasks: [
      { text: 'Vacuum or sweep all shared floor areas',    tier: 'standard'  },
      { text: 'Wipe handrails and banisters',              tier: 'standard'  },
      { text: 'Dust light fixtures in common areas',       tier: 'standard'  },
      { text: 'Wipe light switches throughout',            tier: 'standard'  },
      { text: 'Wipe down baseboards throughout',           tier: 'deep'      },
      { text: 'Clean laundry appliance fronts',            tier: 'deep'      },
      { text: 'Dust vents and returns',                    tier: 'deep'      },
      { text: 'Wipe inside laundry room cabinets',         tier: 'moveinout' },
      { text: 'Full wipe-down of all doors, frames & trim',tier: 'moveinout' },
    ],
  },
];

const EXCLUSIONS = [
  'Chandeliers', 'Fragile Items', 'Biohazards', 'Pest or Infestation Issues',
  'Paint Removal', 'Mold & Mildew', 'Exterior Windows', 'Moving Heavy Furniture',
  'Hard-to-Reach Areas', 'Animal Waste', 'Garages', 'Balconies & Patios',
];

// ─── Check icon ───────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 text-[#2DD4A7] flex-shrink-0 mt-0.5"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CleaningChecklist() {
  const [activeTab, setActiveTab] = useState<TabId>('standard');
  const [visible, setVisible]     = useState(true);

  const handleTabChange = (tab: TabId) => {
    if (tab === activeTab) return;
    setVisible(false);
    setTimeout(() => {
      setActiveTab(tab);
      setVisible(true);
    }, 160);
  };

  const activeTabData = TABS.find(t => t.id === activeTab)!;
  const isIncluded    = (tier: Tier) => TIER_VISIBILITY[tier].includes(activeTab);

  return (
    <section className="bg-gray-50 border-t border-gray-100" style={{ paddingTop: 40, paddingBottom: 40 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ── */}
        <div className="text-center mb-10">
          <div className="inline-block bg-[#0F1C3F] text-[#2DD4A7] text-xs font-extrabold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
            What&apos;s Included
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F1C3F] mb-4">
            Our Cleaning Checklist
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed text-sm">
            Every booking follows a structured, room-by-room process. Select a clean type below
            to see exactly what&apos;s covered — no guesswork, no shortcuts.
          </p>
        </div>

        {/* ── Tabs ── */}
        <div
          role="tablist"
          aria-label="Select cleaning type"
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-2"
        >
          {TABS.map(tab => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls="checklist-panel"
              onClick={() => handleTabChange(tab.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DD4A7] focus-visible:ring-offset-2
                ${activeTab === tab.id
                  ? 'bg-[#0F1C3F] text-white shadow-md scale-105'
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-[#0F1C3F]'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Active tab description ── */}
        <p className={`text-center text-xs text-gray-400 italic mb-8 transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          {activeTabData.description}
        </p>

        {/* ── Animated content panel ── */}
        <div
          id="checklist-panel"
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          className={`transition-all duration-200 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
        >
          {/* Room cards — 4 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {ROOMS.map(room => {
              const includedTasks = room.tasks.filter(t => isIncluded(t.tier));
              return (
                <div
                  key={room.title}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
                >
                  {/* Card header */}
                  <div className="bg-[#0F1C3F] px-4 py-3.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg flex-shrink-0" aria-hidden="true">{room.icon}</span>
                      <h3 className="font-extrabold text-white text-sm leading-tight">
                        {room.title}
                      </h3>
                    </div>
                    <span className="flex-shrink-0 bg-[#2DD4A7] text-[#0F1C3F] text-xs font-extrabold px-2 py-0.5 rounded-full">
                      {includedTasks.length}
                    </span>
                  </div>

                  {/* Task list */}
                  <ul className="flex-1">
                    {includedTasks.map((task, i) => (
                      <li
                        key={i}
                        className={`flex items-start gap-2.5 px-4 py-2.5 ${
                          i < includedTasks.length - 1 ? 'border-b border-gray-100' : ''
                        }`}
                      >
                        <CheckIcon />
                        <span className="text-xs text-gray-700 leading-snug">{task.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* ── Exclusions ── */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5">
            <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest text-center mb-4">
              Not Included in Any Package
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {EXCLUSIONS.map(item => (
                <span
                  key={item}
                  className="bg-gray-50 text-gray-500 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* ── Footer note ── */}
          <p className="text-center text-gray-400 text-xs italic">
            This checklist applies to package-based bookings. For hourly bookings, you set the
            priorities and our team follows your list for the time scheduled.
          </p>
        </div>
      </div>
    </section>
  );
}
