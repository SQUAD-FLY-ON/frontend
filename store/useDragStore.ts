import { DraggingItem } from '@/types';
import { create } from 'zustand';

interface DragState {
  draggingItem: DraggingItem | null;
}

interface DragActions {
  setDraggingItem: (item: DraggingItem | null) => void;
}

export const useDragStore = create<DragState & DragActions>((set) => ({
  draggingItem: null,
  setDraggingItem: (item) => set({ draggingItem: item }),
}));
