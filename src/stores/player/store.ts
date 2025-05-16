import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PlayerState } from './types';

export const usePlayerStore = create<PlayerState>()(
	persist(
		(set) => ({
			duration: 1,
			position: 0,
			volume: 1,
			muted: false,
			src: undefined,
			isPlaying: false,
			currentTrackId: undefined,

			setMuted(muted) {
				set({ muted });
			},

			setVolume(volume) {
				set({ volume });
			},

			setSrc: (src) => set({ src }),
			setPosition: (position) => set({ position }),
			setDuration: (duration) => set({ duration }),
			setIsPlaying: (isPlaying) => set({ isPlaying }),

			play: () => set({ isPlaying: true }),
			pause: () => set({ isPlaying: false }),
			toggle: () => set((state) => ({ isPlaying: !state.isPlaying })),
		}),
		{
			name: 'player-state',
			partialize: (state) => {
				return {
					src: state.src,
					position: state.position,
					duration: state.duration,
					volume: state.volume,
				} as PlayerState;
			},
		}
	)
);
