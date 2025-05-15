import { Download, Eye, Music, FileText } from 'lucide-react';
import { CardHeader, CardTitle } from '../ui/card';
import type { LyricLine } from './lyric-line-item';
import { Button } from '../ui/button';

interface LyricMetadata {
	title: string;
	artist: string;
	album: string;
	timestamps: {
		time: string;
		text: string;
	}[];
}

export interface LRCData {
	metadata: LyricMetadata;
}

export function LyricHeader({
	showPreview,
	setShowPreview,
	generateLRC,
	hasEmptyLyricLines,
	lyricLines,
	onShowExternalLyrics,
	showExternalLyrics,
}: {
	showPreview: boolean;
	setShowPreview: (show: boolean) => void;
	generateLRC: () => LRCData;
	hasEmptyLyricLines: () => boolean;
	lyricLines: LyricLine[];
	showExternalLyrics: boolean;
	onShowExternalLyrics: () => void;
}) {
	return (
		<CardHeader className="flex flex-row items-center justify-between py-8 border-b">
			<CardTitle className="flex items-center gap-2">
				<Music className="h-5 w-5 text-primary" />
				Lyric Editor
			</CardTitle>
			<div className="flex items-center gap-3">
				<Button
					onClick={onShowExternalLyrics}
					variant="outline"
					className="gap-2"
					title="Import lyrics from text"
					disabled={showPreview}
				>
					<FileText className="h-4 w-4" />
					{showExternalLyrics ? 'Hide Lyrics' : 'External Lyrics'}
				</Button>
				<Button
					onClick={() => setShowPreview(!showPreview)}
					variant="outline"
					className="gap-2"
					title="Toggle lyrics preview"
					disabled={
						lyricLines.length === 0 ||
						hasEmptyLyricLines() ||
						showExternalLyrics
					}
					aria-label="Toggle lyrics preview"
				>
					<Eye className="h-4 w-4" />
					{showPreview ? 'Hide Preview' : 'Preview'}
				</Button>
				<Button
					onClick={generateLRC}
					disabled={hasEmptyLyricLines() || lyricLines.length === 0}
					variant={
						hasEmptyLyricLines() || lyricLines.length === 0
							? 'outline'
							: 'default'
					}
					title={
						hasEmptyLyricLines()
							? 'Fill in all lyric lines before downloading'
							: 'Download lyrics in LRC format'
					}
				>
					<Download className="mr-2 h-4 w-4" />
					Download
				</Button>
			</div>
		</CardHeader>
	);
}
