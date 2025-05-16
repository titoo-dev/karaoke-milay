import { createFileRoute } from '@tanstack/react-router';
import { TrackUploadWrapper } from '@/components/track-upload-wrapper';
import { LyricEditor } from '@/components/lyric-studio/lyric-editor';
import { LyricPreviewSection } from '@/components/lyric-studio/lyric-preview-section';
import { ExternalLyricsSection } from '@/components/lyric-studio/external-lyrics-section';
import { useLyricStudioStore } from '@/stores/lyric-studio/store';
import { LyricStudioHeader } from '@/components/lyric-studio/lyrics-studio-header';
import { useShallow } from 'zustand/react/shallow';

export const Route = createFileRoute('/lyric-studio')({
	component: LyricStudioPage,
});

function LyricStudioPage() {
	return (
		<main className="container relative min-h-screen py-6">
			<LyricStudioHeader />

			{/* Main content area */}
			<LyricsCardsWrapper />

			{/* Spacer for fixed player */}
			<div className="h-58"></div>

			{/* Floating track player with integrated timestamp */}
			<div className="fixed bottom-6 left-1/2 z-50 w-full max-w-xl -translate-x-1/2 transform">
				<TrackUploadWrapper
					iconColor="text-blue-500"
					showDownload={false}
				/>
			</div>
		</main>
	);
}

const LyricsCardsWrapper = () => {
	const { showPreview, showExternalLyrics } = useLyricStudioStore(
		useShallow((state) => ({
			showPreview: state.showPreview,
			showExternalLyrics: state.showExternalLyrics,
		}))
	);

	return (
		<div
			className="grid gap-6"
			style={{
				gridTemplateColumns:
					showPreview || showExternalLyrics ? '1fr 1fr' : '1fr',
			}}
		>
			<LyricEditor />

			<LyricPreviewSection />

			<ExternalLyricsSection />
		</div>
	);
};
