import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export type AudioPlayerState = {
	isPlaying: boolean;
	duration: number;
	currentTime: number;
	volume: number;
	isMuted: boolean;
	isWaveformVisible: boolean;
	waveBars: number[];
};

type AudioPlayerActions = {
	setAudioState: (state: Partial<AudioPlayerState>) => void;
	initializeAudio: (audio: HTMLAudioElement) => void;
	playPause: () => void;
	setTime: (time: number) => void;
	setVolume: (volume: number) => void;
	toggleMute: () => void;
	toggleWaveform: () => void;
	generateWaveBars: () => number[];
};

type AudioPlayerStore = AudioPlayerState &
	AudioPlayerActions & {
		audioRef: HTMLAudioElement | null;
	};

export const useTrackPlayerStore = create<AudioPlayerStore>()(
	devtools(
		persist(
			(set, get) => ({
				// State
				audioRef: null,
				isPlaying: false,
				duration: 0,
				currentTime: 0,
				volume: 1,
				isMuted: false,
				isWaveformVisible: true,
				waveBars: Array.from(
					{ length: 50 },
					() => Math.random() * 0.8 + 0.2
				),

				// Actions
				setAudioState: (state) =>
					set((prev) => ({ ...prev, ...state })),

				initializeAudio: (audio) => {
					set({ audioRef: audio });

					audio.addEventListener('loadedmetadata', () => {
						set({ duration: audio.duration });
					});

					audio.addEventListener('timeupdate', () => {
						set({ currentTime: audio.currentTime });
					});

					audio.addEventListener('ended', () => {
						set({ isPlaying: false });
					});
				},

				playPause: () => {
					const { audioRef, isPlaying } = get();
					if (!audioRef) return;

					if (isPlaying) {
						audioRef.pause();
					} else {
						audioRef.play();
					}

					set({ isPlaying: !isPlaying });
				},

				setTime: (time) => {
					const { audioRef } = get();
					if (!audioRef) return;

					audioRef.currentTime = time;
					set({ currentTime: time });
				},

				setVolume: (volume) => {
					const { audioRef } = get();
					if (!audioRef) return;

					audioRef.volume = volume;
					set({ volume });
				},

				toggleMute: () => {
					const { audioRef, isMuted } = get();
					if (!audioRef) return;

					audioRef.muted = !isMuted;
					set({ isMuted: !isMuted });
				},

				toggleWaveform: () => {
					set((state) => ({
						isWaveformVisible: !state.isWaveformVisible,
					}));
				},

				generateWaveBars: () => {
					const waveBars = Array.from(
						{ length: 50 },
						() => Math.random() * 0.8 + 0.2
					);
					set({ waveBars });
					return waveBars;
				},
			}),
			{
				name: 'track-player-storage',
				storage: createJSONStorage(() => localStorage),
				partialize: (state) => ({
					volume: state.volume,
					isMuted: state.isMuted,
					isWaveformVisible: state.isWaveformVisible,
				}),
			}
		)
	)
);
