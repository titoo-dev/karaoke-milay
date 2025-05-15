import { Card, CardContent } from '../ui/card';
import { EmptyLyrics } from './empty-lyrics';
import { LyricHeader, type LRCData } from './lyric-header';
import type { LyricLine } from './lyric-line-item';
import { LyricList } from './lyric-list';

export function LyricEditor({
	lyricLines,
	showPreview,
	setShowPreview,
	generateLRC,
	hasEmptyLyricLines,
	canUseCurrentTime,
	onUpdateLine,
	onDeleteLine,
	onJumpToLine,
	onSetCurrentTime,
	onAddLine,
	showExternalLyrics,
	setShowExternalLyrics,
}: {
	lyricLines: LyricLine[];
	showPreview: boolean;
	setShowPreview: (show: boolean) => void;
	generateLRC: () => LRCData;
	hasEmptyLyricLines: () => boolean;
	canUseCurrentTime: (index: number) => boolean;
	onUpdateLine: (id: number, data: Partial<LyricLine>) => void;
	onDeleteLine: (id: number) => void;
	onJumpToLine: (id: number) => void;
	onSetCurrentTime: (id: number) => void;
	onAddLine: (afterId?: number) => void;
	showExternalLyrics: boolean;
	setShowExternalLyrics: (show: boolean) => void;
}) {
	return (
		<Card className="pt-0 shadow-none">
			<LyricHeader
				showPreview={showPreview}
				setShowPreview={setShowPreview}
				generateLRC={generateLRC}
				hasEmptyLyricLines={hasEmptyLyricLines}
				lyricLines={lyricLines}
				onShowExternalLyrics={() =>
					setShowExternalLyrics(!showExternalLyrics)
				}
				showExternalLyrics={showExternalLyrics}
			/>

			<CardContent className="p-6">
				{lyricLines.length === 0 ? (
					<EmptyLyrics onAddLine={() => onAddLine()} />
				) : (
					<LyricList
						lyricLines={lyricLines}
						canUseCurrentTime={canUseCurrentTime}
						onUpdateLine={onUpdateLine}
						onDeleteLine={onDeleteLine}
						onJumpToLine={onJumpToLine}
						onSetCurrentTime={onSetCurrentTime}
						onAddLine={() => onAddLine()}
					/>
				)}
			</CardContent>
		</Card>
	);
}
