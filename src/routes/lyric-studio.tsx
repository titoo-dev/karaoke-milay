import { createFileRoute } from '@tanstack/react-router';
import { TrackUploadWrapper } from '@/components/track-upload-wrapper';
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
		trackLoaded,
		setLyricLines,
		setTrackLoaded,
	} = useLyricStudioStore();

	const audioRef = useAudioRef();

	// Jump to timestamp of specific lyric line

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
				{showPreview && !showExternalLyrics && <LyricPreviewSection />}

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
