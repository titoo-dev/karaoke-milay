import { PlusCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { LyricLineItem } from './lyric-line-item';
import { useLyricStudioStore } from '@/stores/lyric-studio/store';
import { useShallow } from 'zustand/react/shallow';
import { useAudioRef } from '@/hooks/use-audio-ref';

export function LyricList() {
	const {
		lyricLines,
		updateLyricLine,
		deleteLyricLine,
		jumpToLyricLine,
		setCurrentTimeAsTimestamp,
		addLyricLine,
	} = useLyricStudioStore(
		useShallow((state) => ({
			lyricLines: state.lyricLines,
			updateLyricLine: state.updateLyricLine,
			deleteLyricLine: state.deleteLyricLine,
			jumpToLyricLine: state.jumpToLyricLine,
			setCurrentTimeAsTimestamp: state.setCurrentTimeAsTimestamp,
			addLyricLine: state.addLyricLine,
		}))
	);

	const audioRef = useAudioRef();

	const handleJumpToLine = (id: number) => {
		jumpToLyricLine(id, audioRef.current);
	};

	const handleSetCurrentTime = (id: number) => {
		setCurrentTimeAsTimestamp(id, audioRef.current);
	};

	const handleAddLine = () => {
		addLyricLine(audioRef.current);
	};

	return (
		<div>
			<div className="space-y-3">
				{lyricLines.map((line, index) => (
					<LyricLineItem
						key={line.id}
						line={line}
						index={index}
						onUpdateLine={updateLyricLine}
						onDeleteLine={deleteLyricLine}
						onJumpToLine={handleJumpToLine}
						onSetCurrentTime={handleSetCurrentTime}
						canUseCurrentTime
					/>
				))}
			</div>

			<div className="flex justify-center mt-6 gap-3">
				<Button
					onClick={handleAddLine}
					variant="outline"
					className="gap-2"
				>
					<PlusCircle className="h-4 w-4" />
					Add Line
				</Button>
			</div>
		</div>
	);
}
