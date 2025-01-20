import { Video } from "@/hooks/api/videos/useGetReelVideo";
import { create } from "zustand";

interface WatchHistoryState {
   history: Video[];
   previous: Video | null;
   current: Video | null;
   next: Video | null;
   pushToHistory: (video: Video) => void;
   clearHistory: () => void;
}

export const useWatchHistoryStore = create<WatchHistoryState>((set) => ({
   history: [],
   previous: null,
   current: null,
   next: null,
   pushToHistory: (video) =>
      set((state) => {
         // Don't add duplicate videos
         if (state.history.some((v) => v._id === video._id)) {
            return state;
         }

         return {
            history: [video, ...state.history],
            previous: state.current,
            current: video,
            next: null, // Reset next since we're adding a new video
         };
      }),
   clearHistory: () =>
      set({
         history: [],
         previous: null,
         current: null,
         next: null,
      }),
}));
