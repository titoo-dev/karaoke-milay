import { Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { LyricLine } from './lyric-line-item';
import { LyricsPreviewCard } from '../lyrics-preview-card';

export function LyricPreviewSection({ lyrics }: { lyrics: LyricLine[] }) {
	return (
		<Card className="pt-0 shadow-none overflow-hidden">
			<CardHeader className="flex flex-row items-center border-b pt-6">
				<CardTitle className="flex items-center gap-2 py-3">
					<Eye className="h-5 w-5 text-primary" />
					Lyrics Preview
				</CardTitle>
			</CardHeader>
			<CardContent className="p-0">
				<LyricsPreviewCard lyrics={lyrics} />
			</CardContent>
		</Card>
	);
}
