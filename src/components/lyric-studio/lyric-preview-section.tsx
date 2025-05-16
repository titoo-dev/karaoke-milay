import { Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LyricsPreviewCard } from '../lyrics-preview-card';
import { useLyricStudioStore } from '@/stores/lyric-studio/store';
import { useShallow } from 'zustand/react/shallow';

export function LyricPreviewSection() {
	const { showPreview, showExternalLyrics } = useLyricStudioStore(
		useShallow((state) => ({
			showPreview: state.showPreview,
			showExternalLyrics: state.showExternalLyrics,
		}))
	);

	if (!showPreview || showExternalLyrics) return null;

	return (
		<Card className="pt-0 shadow-none overflow-hidden">
			<CardHeader className="flex flex-row items-center border-b pt-6">
				<CardTitle className="flex items-center gap-2 py-3">
					<Eye className="h-5 w-5 text-primary" />
					Lyrics Preview
				</CardTitle>
			</CardHeader>
			<CardContent className="p-0">
				<LyricsPreviewCard />
			</CardContent>
		</Card>
	);
}
