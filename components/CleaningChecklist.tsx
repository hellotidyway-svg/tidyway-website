'use client';

import { useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

type TabId = 'standard' | 'deep' | 'moveinout' | 'postreno';
type Tier  = 'standard' | 'deep' | 'moveinout' | 'postreno';

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
    description:
      'All standard tasks, plus cabinet exteriors, baseboards, window frames, and more.',
  },
  {
    id: 'moveinout',
    label: 'Move-In / Move-Out',
    description:
      'Our most thorough clean. Deep clean tasks plus walls, vents, inside appliances, and ceilings.',
  },
  {
    id: 'postreno',
    label: 'Post-Renovation',
    description:
      'Specialized clean after construction work. Dust, debris, and residue removed throughout.',
  },
];

// Which tabs include each tier
const TIER_VISIBILITY: Record<Tier, TabId[]> = {
  standard:  ['standard', 'deep', 'moveinout', 'postreno'],
  deep:      ['deep', 'moveinout', 'postreno'],
  moveinout: ['moveinout'],
  postreno:  ['postreno'],
};

// ─── Checklist data ───────────────────────────────────────────────────────────

const ROOMS: Room[] = [
  {
    title: 'Bedrooms & Living Areas',
    icon: '🛏',
    tasks: [
      { text: 'Dust and wipe all accessible surfaces',       tier: 'standard'  },
      { text: 'Vacuum or sweep all floors',                   tier: 'standard'  },
      { text: 'Empty waste bins',                             tier: 'standard'  },
      { text: 'Wipe light switches and door handles',         tier: 'standard'  },
      { text: 'Straighten and tidy the space',                tier: 'standard'  },
      { text: 'Dust ceiling fans and light fixtures',         tier: 'standard'  },
      { text: 'Clean mirrors and glass surfaces',             tier: 'standard'  },
      { text: 'Wipe windowsills',                             tier: 'standard'  },
      { text: 'Wipe down baseboards',                         tier: 'deep'      },
      { text: 'Clean exterior of all furniture',              tier: 'deep'      },
      { text: 'Wipe window frames and tracks',                tier: 'deep'      },
      { text: 'Vacuum upholstered furniture',                 tier: 'deep'      },
      { text: 'Dust and wipe wall art and decor',             tier: 'deep'      },
      { text: 'Wipe interior of closets and shelving',        tier: 'moveinout' },
      { text: 'Clean inside all cupboards and drawers',       tier: 'moveinout' },
      { text: 'Wash walls and spot-clean scuffs',             tier: 'moveinout' },
      { text: 'Remove construction dust from all surfaces, ledges, and vents', tier: 'postreno' },
      { text: 'Wipe down newly installed fixtures and fittings',               tier: 'postreno' },
      { text: 'Vacuum fine dust from floors and carpets',                       tier: 'postreno' },
    ],
  },
  {
    title: 'Kitchen',
    icon: '🍳',
    tasks: [
      { text: 'Wipe countertops and backsplash',                              tier: 'standard'  },
      { text: 'Clean stovetop surface (exterior only)',                        tier: 'standard'  },
      { text: 'Wipe exterior of appliances',                                   tier: 'standard'  },
      { text: 'Clean sink and faucet fixtures',                                tier: 'standard'  },
      { text: 'Sweep and mop floors',                                          tier: 'standard'  },
      { text: 'Wipe cabinet door exteriors',                                   tier: 'standard'  },
      { text: 'Empty and reline waste bins',                                   tier: 'standard'  },
      { text: 'Degrease range hood and filters',                               tier: 'deep'      },
      { text: 'Clean inside microwave',                                        tier: 'deep'      },
      { text: 'Wipe interior and exterior of oven (exterior only — inside oven is an add-on)', tier: 'deep' },
      { text: 'Wipe down and sanitize fridge exterior',                        tier: 'deep'      },
      { text: 'Scrub sink and remove buildup from fixtures',                   tier: 'deep'      },
      { text: 'Clean inside oven (included in scope)',                         tier: 'moveinout' },
      { text: 'Clean inside fridge (included in scope)',                       tier: 'moveinout' },
      { text: 'Wipe inside all cabinets and drawers',                          tier: 'moveinout' },
      { text: 'Sanitize all surfaces',                                         tier: 'moveinout' },
      { text: 'Remove drywall dust and debris from all surfaces',              tier: 'postreno'  },
      { text: 'Wipe down new cabinetry and hardware',                          tier: 'postreno'  },
      { text: 'Flush dust from exhaust and range hood',                        tier: 'postreno'  },
    ],
  },
  {
    title: 'Bathrooms',
    icon: '🚿',
    tasks: [
      { text: 'Scrub and sanitize toilet (bowl, seat, lid, and base)',  tier: 'standard'  },
      { text: 'Clean and shine sink and faucet',                         tier: 'standard'  },
      { text: 'Wipe vanity and countertop',                              tier: 'standard'  },
      { text: 'Scrub shower and/or tub',                                 tier: 'standard'  },
      { text: 'Clean mirrors',                                           tier: 'standard'  },
      { text: 'Sweep and mop floors',                                    tier: 'standard'  },
      { text: 'Empty waste bins',                                        tier: 'standard'  },
      { text: 'Wipe light switches and door handles',                    tier: 'standard'  },
      { text: 'Descale showerhead and faucets',                          tier: 'deep'      },
      { text: 'Scrub grout lines in tile',                               tier: 'deep'      },
      { text: 'Wipe baseboards and door frames',                         tier: 'deep'      },
      { text: 'Clean exhaust fan cover',                                 tier: 'deep'      },
      { text: 'Wipe inside vanity drawers and cabinets',                 tier: 'moveinout' },
      { text: 'Deep scrub all tile from top to bottom',                  tier: 'moveinout' },
      { text: 'Sanitize all contact surfaces',                           tier: 'moveinout' },
      { text: 'Remove plaster dust and debris from all surfaces and fixtures', tier: 'postreno' },
      { text: 'Wipe newly installed tile, fixtures, and hardware',             tier: 'postreno' },
      { text: 'Rinse and clean drain covers',                                  tier: 'postreno' },
    ],
  },
  {
    title: 'Hallways, Stairs & Laundry',
    icon: '🏠',
    tasks: [
      { text: 'Vacuum or sweep all shared floor areas',                 tier: 'standard'  },
      { text: 'Wipe handrails and banisters',                           tier: 'standard'  },
      { text: 'Dust light fixtures in common areas',                    tier: 'standard'  },
      { text: 'Wipe light switches throughout',                         tier: 'standard'  },
      { text: 'Wipe down baseboards throughout',                        tier: 'deep'      },
      { text: 'Clean laundry room exterior surfaces and appliance fronts', tier: 'deep'   },
      { text: 'Dust vents and returns',                                  tier: 'deep'      },
      { text: 'Wipe inside laundry room cabinets',                      tier: 'moveinout' },
      { text: 'Full wipe-down of all doors, frames, and trim',          tier: 'moveinout' },
      { text: 'Vacuum all vents and returns',                           tier: 'postreno'  },
      { text: 'Remove construction debris from all shared areas',       tier: 'postreno'  },
      { text: 'Wipe all new trim, doors, and hardware',                 tier: 'postreno'  },
    ],
  },
];

const EXCLUSIONS = [
  'Chandeliers', 'Fragile Items', 'Biohazards', 'Pest or Infestation Issues',
  'Paint Removal', 'Mold & Mildew', 'Exterior Windows', 'Moving Heavy Furniture',
  'Hard-to-Reach Areas', 'Animal Waste', 'Garages', 'Balconies & Patios',
];

// ─── Icons ────────────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg
      className="w-4 h-4 text-[#2DD4A7] flex-shrink-0 mt-0.5"
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

function LockIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 mt-0.5"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
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

  const isIncluded = (tier: Tier) => TIER_VISIBILITY[tier].includes(activeTab);

  return (
    <section className="bg-white border-t border-gray-100" style={{ paddingTop: 40, paddingBottom: 40 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ── */}
        <div className="text-center mb-12">
          <span className="text-[#2DD4A7] text-xs font-extrabold uppercase tracking-widest mb-3 block">
            What&apos;s Included
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F1C3F] mb-4">
            Our Cleaning Checklist
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Every booking follows a structured, room-by-room process. Select a clean type below
            to see exactly what&apos;s covered — no guesswork, no shortcuts.
          </p>
        </div>

        {/* ── Tabs ── */}
        <div
          role="tablist"
          aria-label="Select cleaning type"
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-3"
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
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-[#0F1C3F]'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Active tab description ── */}
        <p
          className={`text-center text-sm text-gray-400 italic mb-10 transition-all duration-200 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {activeTabData.description}
        </p>

        {/* ── Animated content panel ── */}
        <div
          id="checklist-panel"
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          className={`transition-all duration-200 ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          {/* Room cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {ROOMS.map(room => {
              const includedCount = room.tasks.filter(t => isIncluded(t.tier)).length;

              return (
                <div
                  key={room.title}
                  className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Card header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl" aria-hidden="true">{room.icon}</span>
                      <h3 className="font-extrabold text-[#0F1C3F] text-lg leading-tight">
                        {room.title}
                      </h3>
                    </div>
                    <span className="flex-shrink-0 bg-[#f0fdf9] text-[#0F1C3F] text-xs font-bold px-3 py-1 rounded-full border border-[#2DD4A7]/25">
                      {includedCount} task{includedCount !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Task list */}
                  <ul className="space-y-2.5">
                    {room.tasks.map((task, i) => {
                      const included = isIncluded(task.tier);
                      return (
                        <li
                          key={i}
                          className={`flex items-start gap-2.5 transition-opacity duration-200 ${
                            included ? 'opacity-100' : 'opacity-25'
                          }`}
                        >
                          {included ? <CheckIcon /> : <LockIcon />}
                          <span
                            className={`text-sm leading-snug ${
                              included ? 'text-gray-700' : 'text-gray-400'
                            }`}
                          >
                            {task.text}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* ── Exclusions ── */}
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-7">
            <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest text-center mb-5">
              Not Included in Any Package
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {EXCLUSIONS.map(item => (
                <span
                  key={item}
                  className="bg-white text-gray-500 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* ── Footer note ── */}
          <p className="text-center text-gray-400 text-sm italic mt-6">
            This checklist applies to package-based bookings. For hourly bookings, you set the
            priorities and our team follows your list for the time scheduled.
          </p>
        </div>
      </div>
    </section>
  );
}
