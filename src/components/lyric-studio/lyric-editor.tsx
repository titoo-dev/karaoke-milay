import { Card, CardContent } from '../ui/card';
import { EmptyLyrics } from './empty-lyrics';
import { LyricHeader } from './lyric-header';
import { LyricList } from './lyric-list';
import { useLyricStudioStore } from '@/stores/lyric-studio/store';
import { useRef } from 'react';

export function LyricEditor() {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const {
		lyricLines,
		showPreview,
		showExternalLyrics,
		setShowPreview,
		setShowExternalLyrics,
		updateLyricLine,
		deleteLyricLine,
		jumpToLyricLine,
		setCurrentTimeAsTimestamp,
		addLyricLine,
		hasEmptyLyricLines,
		generateLRC,
	} = useLyricStudioStore();

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
					<EmptyLyrics
						onAddLine={() => addLyricLine(audioRef.current)}
					/>
				) : (
					<LyricList
						lyricLines={lyricLines}
						onUpdateLine={updateLyricLine}
						onDeleteLine={deleteLyricLine}
						onJumpToLine={(id) =>
							jumpToLyricLine(id, audioRef.current)
						}
						onSetCurrentTime={(id) =>
							setCurrentTimeAsTimestamp(id, audioRef.current)
						}
						onAddLine={() => addLyricLine(audioRef.current)}
					/>
				)}
			</CardContent>
		</Card>
	);
}
