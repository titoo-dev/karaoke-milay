import { Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { LyricLine } from './lyric-line-item';
import { LyricsPreviewCard } from '../lyrics-preview-card';

export function LyricPreviewSection({
	lyrics,
	currentTime,
	onLyricClick,
}: {
	lyrics: LyricLine[];
	currentTime: number;
	onLyricClick: (id: number) => void;
}) {
	return (
		<Card className="pt-0 shadow-none overflow-hidden">
			<CardHeader className="flex flex-row items-center py-6 border-b">
				<CardTitle className="flex items-center gap-2">
					<Eye className="h-5 w-5 text-primary" />
					Lyrics Preview
				</CardTitle>
			</CardHeader>
			<CardContent className="p-0">
				<LyricsPreviewCard
					lyrics={lyrics}
					currentTime={currentTime}
					onLyricClick={onLyricClick}
				/>
			</CardContent>
		</Card>
	);
}
