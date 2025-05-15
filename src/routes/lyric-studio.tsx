import { createFileRoute } from '@tanstack/react-router';
import { TrackUploadWrapper } from '@/components/track-upload-wrapper';
import { useRef, useState, useEffect } from 'react';
import { type LyricLine } from '@/components/lyric-studio/lyric-line-item';
import { formatLRCTimestamp } from '@/lib/utils';
import type { LRCData } from '@/components/lyric-studio/lyric-header';
import { LyricEditor } from '@/components/lyric-studio/lyric-editor';
import { LyricPreviewSection } from '@/components/lyric-studio/lyric-preview-section';

export const Route = createFileRoute('/lyric-studio')({
	component: LyricStudioPage,
});

function LyricStudioPage() {
	const [lyricLines, setLyricLines] = useState<LyricLine[]>([]);
	const [showPreview, setShowPreview] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [trackLoaded, setTrackLoaded] = useState(false);
	const audioRef = useRef<HTMLAudioElement>(null!);

	// Track when audio loaded or removed to reinitialize time tracking
	useEffect(() => {
		if (trackLoaded) {
			setCurrentTime(0); // Reset time when new track is loaded
		}
	}, [trackLoaded]);

	// Update current time when audio plays
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const updateTime = () => setCurrentTime(audio.currentTime);
		audio.addEventListener('timeupdate', updateTime);

		return () => {
			audio.removeEventListener('timeupdate', updateTime);
		};
	}, [trackLoaded]); // Re-run effect when audio track changes

	// Check if setting a timestamp at index would violate ascending sequence
	const isValidTimestampPosition = (
		index: number,
		timestamp: number
	): boolean => {
		const prevLine = index > 0 ? lyricLines[index - 1] : null;
		const nextLine =
			index < lyricLines.length - 1 ? lyricLines[index + 1] : null;

		if (prevLine && timestamp < prevLine.timestamp) return false;
		if (nextLine && timestamp > nextLine.timestamp) return false;

		return true;
	};

	// Find index of line by id
	const getLineIndexById = (id: number): number => {
		return lyricLines.findIndex((line) => line.id === id);
	};

	// Jump to timestamp of specific lyric line
	const jumpToLyricLine = (id: number) => {
		const line = lyricLines.find((line) => line.id === id);
		if (line && audioRef.current) {
			audioRef.current.currentTime = line.timestamp;
			audioRef.current
				.play()
				.catch((err) => console.error('Playback failed:', err));
		}
	};

	const addLyricLine = (afterId?: number) => {
		const newId = Math.max(0, ...lyricLines.map((line) => line.id)) + 1;
		const currentTimestamp = audioRef.current?.currentTime || 0;

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
			setLyricLines(newLines);
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

			setLyricLines([
				...lyricLines,
				{ id: newId, text: '', timestamp: newTimestamp },
			]);
		}
	};

	const updateLyricLine = (id: number, data: Partial<LyricLine>) => {
		// If updating timestamp, validate it follows ascending sequence
		if ('timestamp' in data) {
			const index = getLineIndexById(id);
			if (!isValidTimestampPosition(index, data.timestamp as number)) {
				return; // Don't update if it violates the sequence
			}
		}

		setLyricLines(
			lyricLines.map((line) =>
				line.id === id ? { ...line, ...data } : line
			)
		);
	};

	const deleteLyricLine = (id: number) => {
		setLyricLines(lyricLines.filter((line) => line.id !== id));
	};

	const setCurrentTimeAsTimestamp = (id: number) => {
		if (audioRef.current) {
			const index = getLineIndexById(id);
			const newTimestamp = audioRef.current.currentTime;

			// Only update if it maintains ascending sequence
			if (isValidTimestampPosition(index, newTimestamp)) {
				updateLyricLine(id, { timestamp: newTimestamp });
			}
		}
	};

	// Check if current audio time can be used as timestamp for a specific line
	const canUseCurrentTime = (index: number): boolean => {
		if (!audioRef.current) return false;
		return isValidTimestampPosition(index, audioRef.current.currentTime);
	};

	// Check if all lyric lines have text
	const hasEmptyLyricLines = (): boolean => {
		return lyricLines.some((line) => line.text.trim() === '');
	};

	// Generate LRC format and log it
	const generateLRC = (): LRCData => {
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
	};

	return (
		<main className="container relative min-h-screen py-6">
			<div className="mb-6">
				<h1 className="text-3xl font-bold tracking-tight">
					Lyric Studio
				</h1>
				<p className="text-muted-foreground">
					{trackLoaded
						? 'Create and edit lyrics for your track'
						: 'Upload an audio track to get started'}
				</p>
			</div>

			{/* Main content area */}
			<div
				className="grid gap-6"
				style={{ gridTemplateColumns: showPreview ? '1fr 1fr' : '1fr' }}
			>
				<LyricEditor
					lyricLines={lyricLines}
					showPreview={showPreview}
					setShowPreview={setShowPreview}
					generateLRC={generateLRC}
					hasEmptyLyricLines={hasEmptyLyricLines}
					canUseCurrentTime={canUseCurrentTime}
					onUpdateLine={updateLyricLine}
					onDeleteLine={deleteLyricLine}
					onJumpToLine={jumpToLyricLine}
					onSetCurrentTime={setCurrentTimeAsTimestamp}
					onAddLine={addLyricLine}
				/>

				{/* Lyrics preview section */}
				{showPreview && (
					<LyricPreviewSection
						lyrics={lyricLines}
						currentTime={currentTime}
						onLyricClick={jumpToLyricLine}
					/>
				)}
			</div>

			{/* Spacer for fixed player */}
			<div className="h-58"></div>

			{/* Floating track player with integrated timestamp */}
			<div className="fixed bottom-6 left-1/2 z-50 w-full max-w-xl -translate-x-1/2 transform">
				<TrackUploadWrapper
					iconColor="text-blue-500"
					showDownload={false}
					audioRef={audioRef}
					onAudioLoad={() => setTrackLoaded(true)}
					onAudioRemove={() => setTrackLoaded(false)}
				/>
			</div>
		</main>
	);
}
