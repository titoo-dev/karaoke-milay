import { create } from 'zustand';
import { formatLRCTimestamp } from '@/lib/utils';
import type { LyricLine } from '@/components/lyric-studio/lyric-line-item';
import type { LRCData } from '@/components/lyric-studio/lyric-editor-header';

interface LyricStudioState {
	lyricLines: LyricLine[];
	showPreview: boolean;
	showExternalLyrics: boolean;
	trackLoaded: boolean;

	// Actions
	setLyricLines: (lines: LyricLine[]) => void;
	setShowPreview: (show: boolean) => void;
	setShowExternalLyrics: (show: boolean) => void;
	setTrackLoaded: (loaded: boolean) => void;

	// Business logic
	jumpToLyricLine: (
		id: number,
		audioElement: HTMLAudioElement | null
	) => void;
	addLyricLine: (
		audioElement: HTMLAudioElement | null,
		afterId?: number
	) => void;
	updateLyricLine: (id: number, data: Partial<LyricLine>) => void;
	deleteLyricLine: (id: number) => void;
	setCurrentTimeAsTimestamp: (
		id: number,
		audioElement: HTMLAudioElement | null
	) => void;
	hasEmptyLyricLines: () => boolean;
	generateLRC: () => LRCData;
	addLinesFromExternal: (
		externalLines: string[],
		audioElement: HTMLAudioElement | null
	) => void;
}

export const useLyricStudioStore = create<LyricStudioState>((set, get) => ({
	lyricLines: [],
	showPreview: false,
	showExternalLyrics: false,
	trackLoaded: false,

	// Actions
	setLyricLines: (lines) => set({ lyricLines: lines }),
	setShowPreview: (show) => set({ showPreview: show }),
	setShowExternalLyrics: (show) => set({ showExternalLyrics: show }),
	setTrackLoaded: (loaded) => {
		set({ trackLoaded: loaded });
	},

	// Business logic
	jumpToLyricLine: (id, audioElement) => {
		const { lyricLines } = get();
		const line = lyricLines.find((line) => line.id === id);
		if (line && audioElement) {
			audioElement.currentTime = line.timestamp;
			audioElement
				.play()
				.catch((err) => console.error('Playback failed:', err));
		}
	},

	addLyricLine: (audioElement, afterId) => {
		const { lyricLines } = get();
		const newId = Math.max(0, ...lyricLines.map((line) => line.id)) + 1;
		const currentTimestamp = audioElement?.currentTime || 0;

		if (afterId) {
			const index = lyricLines.findIndex((line) => line.id === afterId);
			const newLines = [...lyricLines];

			// Ensure the new timestamp follows ascending sequence
			let newTimestamp = currentTimestamp;
			const prevTimestamp = newLines[index].timestamp;
			const nextTimestamp =
				index < newLines.length - 1
					? newLines[index + 1].timestamp
					: Infinity;

			// Make sure timestamp is between prev and next
			if (newTimestamp <= prevTimestamp) {
				newTimestamp = prevTimestamp + 0.5; // Add a small increment
			}
			if (nextTimestamp !== Infinity && newTimestamp >= nextTimestamp) {
				newTimestamp = (prevTimestamp + nextTimestamp) / 2; // Use middle point
			}

			newLines.splice(index + 1, 0, {
				id: newId,
				text: '',
				timestamp: newTimestamp,
			});
			set({ lyricLines: newLines });
		} else {
			// For adding at the end, make sure it's greater than the last timestamp
			let newTimestamp = currentTimestamp;
			if (lyricLines.length > 0) {
				const lastTimestamp =
					lyricLines[lyricLines.length - 1].timestamp;
				if (newTimestamp <= lastTimestamp) {
					newTimestamp = lastTimestamp + 0.5; // Add a small increment
				}
			}

			set({
				lyricLines: [
					...lyricLines,
					{ id: newId, text: '', timestamp: newTimestamp },
				],
			});
		}
	},

	updateLyricLine: (id, data) => {
		const { lyricLines } = get();
		set({
			lyricLines: lyricLines.map((line) =>
				line.id === id ? { ...line, ...data } : line
			),
		});
	},

	deleteLyricLine: (id) => {
		const { lyricLines } = get();
		set({ lyricLines: lyricLines.filter((line) => line.id !== id) });
	},

	setCurrentTimeAsTimestamp: (id, audioElement) => {
		if (audioElement) {
			const newTimestamp = audioElement.currentTime;
			get().updateLyricLine(id, { timestamp: newTimestamp });
		}
	},

	hasEmptyLyricLines: () => {
		const { lyricLines } = get();
		return lyricLines.some((line) => line.text.trim() === '');
	},

	generateLRC: () => {
		const { lyricLines } = get();
		// Sort lyrics by timestamp to ensure proper order
		const sortedLyrics = [...lyricLines].sort(
			(a, b) => a.timestamp - b.timestamp
		);

		const lrcData: LRCData = {
			metadata: {
				title: 'Untitled Song',
				artist: 'Unknown Artist',
				album: 'Unknown Album',
				timestamps: sortedLyrics.map((line) => ({
					time: formatLRCTimestamp(line.timestamp),
					text: line.text,
				})),
			},
		};

		console.log('LRC Data (JSON format):', lrcData);
		return lrcData;
	},

	addLinesFromExternal: (externalLines, audioElement) => {
		if (externalLines.length === 0) return;

		const { lyricLines } = get();
		// Get current timestamp as starting point
		const currentTimestamp = audioElement?.currentTime || 0;

		// Create a new lyric line for each external line with incremental timestamps
		const newLines = externalLines.map((text, index) => {
			const newId =
				Math.max(0, ...lyricLines.map((line) => line.id)) + index + 1;
			// Add 2 seconds between each line
			const timestamp = currentTimestamp + index * 2;
			return {
				id: newId,
				text,
				timestamp,
			};
		});

		set({ lyricLines: newLines });
	},
}));
