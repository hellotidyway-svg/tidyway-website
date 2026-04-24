export type Frequency = 'one-time' | 'weekly' | 'biweekly' | 'monthly';
export type Bedrooms = 'Studio' | '1' | '2' | '3' | '4' | '5';
export type Bathrooms = '1' | '1.5' | '2' | '2.5' | '3' | '3.5' | '4' | '4.5' | '5';

export interface AddOn {
  id: string;
  label: string;
  description: string;
  price: number;
  durationMinutes: number;
}

export const FREQUENCIES: Frequency[] = ['one-time', 'weekly', 'biweekly', 'monthly'];

export const FREQUENCY_LABELS: Record<Frequency, string> = {
  'one-time': 'One-Time',
  'weekly': 'Weekly',
  'biweekly': 'Bi-Weekly',
  'monthly': 'Monthly',
};

export const FREQUENCY_DISCOUNTS: Record<Frequency, number | null> = {
  'one-time': null,
  'weekly': 20,
  'biweekly': 15,
  'monthly': 10,
};

export const BEDROOM_OPTIONS: Bedrooms[] = ['Studio', '1', '2', '3', '4', '5'];
export const BATHROOM_OPTIONS: Bathrooms[] = ['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5'];

export const ADD_ONS: AddOn[] = [
  {
    id: 'oven',
    label: 'Inside Oven',
    description: 'Deep clean oven interior, racks & door',
    price: 35,
    durationMinutes: 30,
  },
  {
    id: 'fridge',
    label: 'Inside Fridge',
    description: 'Wipe shelves, drawers & door seals',
    price: 30,
    durationMinutes: 20,
  },
  {
    id: 'windows',
    label: 'Interior Windows',
    description: 'Clean glass panes & sills throughout',
    price: 45,
    durationMinutes: 45,
  },
  {
    id: 'laundry',
    label: 'Laundry (Wash & Fold)',
    description: 'Wash, dry & fold one load of laundry',
    price: 40,
    durationMinutes: 30,
  },
  {
    id: 'cabinets',
    label: 'Inside Cabinets',
    description: 'Empty and wipe all cabinet interiors',
    price: 50,
    durationMinutes: 45,
  },
  {
    id: 'balcony',
    label: 'Balcony / Patio',
    description: 'Sweep and wipe down furniture & railings',
    price: 35,
    durationMinutes: 30,
  },
  {
    id: 'eco',
    label: 'Eco-Friendly Products',
    description: 'All-natural, non-toxic cleaning products',
    price: 15,
    durationMinutes: 0,
  },
];

const BASE_PRICES: Record<Bedrooms, number> = {
  Studio: 120,
  '1': 149,
  '2': 189,
  '3': 229,
  '4': 279,
  '5': 329,
};

const BATHROOM_PRICE_ADD: Record<Bathrooms, number> = {
  '1': 0,
  '1.5': 20,
  '2': 40,
  '2.5': 60,
  '3': 80,
  '3.5': 100,
  '4': 120,
  '4.5': 140,
  '5': 160,
};

const FREQUENCY_MULTIPLIERS: Record<Frequency, number> = {
  'one-time': 1.0,
  'monthly': 0.90,
  'biweekly': 0.85,
  'weekly': 0.80,
};

const BASE_DURATIONS_MINS: Record<Bedrooms, number> = {
  Studio: 120,
  '1': 150,
  '2': 180,
  '3': 210,
  '4': 240,
  '5': 270,
};

const BATHROOM_DURATION_ADD_MINS: Record<Bathrooms, number> = {
  '1': 0,
  '1.5': 15,
  '2': 30,
  '2.5': 45,
  '3': 60,
  '3.5': 75,
  '4': 90,
  '4.5': 105,
  '5': 120,
};

export interface PriceInput {
  bedrooms: Bedrooms | '';
  bathrooms: Bathrooms | '';
  frequency: Frequency;
  addOnIds: string[];
}

export function calculatePrice(input: PriceInput): number | null {
  if (!input.bedrooms || !input.bathrooms) return null;
  const base = BASE_PRICES[input.bedrooms] + BATHROOM_PRICE_ADD[input.bathrooms];
  const withFrequency = Math.round(base * FREQUENCY_MULTIPLIERS[input.frequency]);
  const addOnsTotal = input.addOnIds.reduce((sum, id) => {
    const addOn = ADD_ONS.find(a => a.id === id);
    return sum + (addOn?.price ?? 0);
  }, 0);
  return withFrequency + addOnsTotal;
}

export function calculateDuration(input: PriceInput): string | null {
  if (!input.bedrooms || !input.bathrooms) return null;
  const totalMins =
    BASE_DURATIONS_MINS[input.bedrooms] +
    BATHROOM_DURATION_ADD_MINS[input.bathrooms] +
    input.addOnIds.reduce((sum, id) => {
      const addOn = ADD_ONS.find(a => a.id === id);
      return sum + (addOn?.durationMinutes ?? 0);
    }, 0);
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  if (mins === 0) return `${hours} hr`;
  return `${hours} hr ${mins} min`;
}
