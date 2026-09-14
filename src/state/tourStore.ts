import { create } from 'zustand';

import { TOUR_STEPS } from '../data/tour';
import { getTourCanvasSize, measureTourTarget, MeasuredRect } from '../hooks/useTourTarget';

export type Spot = MeasuredRect & { radius: number };

type TourState = {
  /** null when the tour isn't running. */
  stepIndex: number | null;
  spots: Spot[] | null;
  cardOnTop: boolean;

  start: () => void;
  next: () => void;
  back: () => void;
  skip: () => void;
  remeasure: () => Promise<void>;
};


export const useTourStore = create<TourState>((set, get) => ({
  stepIndex: null,
  spots: null,
  cardOnTop: false,

  start: () => {
    set({ stepIndex: 0 });
    get().remeasure();
  },

  next: () => {
    const current = get().stepIndex ?? 0;
    const n = current + 1;
    if (n >= TOUR_STEPS.length) {
      set({ stepIndex: null, spots: null });
      return;
    }
    set({ stepIndex: n });
    get().remeasure();
  },

  back: () => {
    const p = Math.max(0, (get().stepIndex ?? 0) - 1);
    set({ stepIndex: p });
    get().remeasure();
  },

  skip: () => set({ stepIndex: null, spots: null }),

  remeasure: async () => {
    const index = get().stepIndex;
    if (index === null) return;
    const step = TOUR_STEPS[index];

    // Give the tab switch / navigation a frame to lay out before measuring.
    await new Promise((resolve) => setTimeout(resolve, 80));

    const contentRect = await measureTourTarget(step.targetKey);
    const tabRect = await measureTourTarget(`tab-${step.tab}`);

    const pad = (rect: MeasuredRect, amount: number, radius: number): Spot => ({
      x: rect.x - amount,
      y: rect.y - amount,
      width: rect.width + amount * 2,
      height: rect.height + amount * 2,
      radius,
    });

    const spots: Spot[] = [];
    if (contentRect) spots.push(pad(contentRect, 8, 16));
    if (tabRect) spots.push(pad(tabRect, 3, 12));

    const screenHeight = getTourCanvasSize().height;
    const cardOnTop = contentRect ? contentRect.y + contentRect.height / 2 > screenHeight * 0.48 : false;

    set({ spots: spots.length ? spots : null, cardOnTop });
  },
}));
