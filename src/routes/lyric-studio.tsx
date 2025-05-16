import { createFileRoute } from '@tanstack/react-router';
import { TrackUploadWrapper } from '@/components/track-upload-wrapper';
import { useEffect } from 'react';
import { LyricEditor } from '@/components/lyric-studio/lyric-editor';
import { LyricPreviewSection } from '@/components/lyric-studio/lyric-preview-section';
import { ExternalLyricsSection } from '@/components/lyric-studio/external-lyrics-section';
import { useLyricStudioStore } from '@/stores/lyric-studio/store';
import { useAudioRef } from '@/hooks/use-audio-ref';
import { LyricStudioHeader } from '@/components/lyric-studio/lyrics-studio-header';

export const Route = createFileRoute('/lyric-studio')({
	component: LyricStudioPage,
});

function LyricStudioPage() {
	const {
		lyricLines,
		showPreview,
		showExternalLyrics,
		currentTime,
		trackLoaded,
		setLyricLines,
		setCurrentTime,
		setTrackLoaded,
	} = useLyricStudioStore();

	const audioRef = useAudioRef();

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

	// Function to add multiple lines from external lyrics
	const addLinesFromExternal = (externalLines: string[]) => {
		if (externalLines.length === 0) return;

		// Get current timestamp as starting point
		const currentTimestamp = audioRef.current?.currentTime || 0;

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

		setLyricLines(newLines);
	};

	return (
		<main className="container relative min-h-screen py-6">
			<LyricStudioHeader trackLoaded={trackLoaded} />

			{/* Main content area */}
			<div
				className="grid gap-6"
				style={{
					gridTemplateColumns:
						showPreview || showExternalLyrics ? '1fr 1fr' : '1fr',
				}}
			>
				<LyricEditor />

				{/* Lyrics preview or external lyrics section */}
				{showPreview && !showExternalLyrics && (
					<LyricPreviewSection
						lyrics={lyricLines}
						currentTime={currentTime}
						onLyricClick={jumpToLyricLine}
					/>
				)}

				{/* External lyrics input */}
				{showExternalLyrics && (
					<ExternalLyricsSection
						onConvertToLines={addLinesFromExternal}
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
					onAudioLoad={() => setTrackLoaded(true)}
					onAudioRemove={() => setTrackLoaded(false)}
				/>
			</div>
		</main>
	);
}
