import { useWatchHistoryStore } from "@/store/watchHistoryStore";

export const useWatchHistoryState = () => {
   const history = useWatchHistoryStore((state) => state.history);
   const previous = useWatchHistoryStore((state) => state.previous);
   const current = useWatchHistoryStore((state) => state.current);
   const next = useWatchHistoryStore((state) => state.next);
   const pushToHistory = useWatchHistoryStore((state) => state.pushToHistory);
   const clearHistory = useWatchHistoryStore((state) => state.clearHistory);

   return {
      history,
      previous,
      current,
      next,
      pushToHistory,
      clearHistory,
   };
};
