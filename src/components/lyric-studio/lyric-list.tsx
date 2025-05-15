import { PlusCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { LyricLineItem, type LyricLine } from './lyric-line-item';

export function LyricList({
	lyricLines,
	canUseCurrentTime,
	onUpdateLine,
	onDeleteLine,
	onJumpToLine,
	onSetCurrentTime,
	onAddLine,
}: {
	lyricLines: LyricLine[];
	canUseCurrentTime: (index: number) => boolean;
	onUpdateLine: (id: number, data: Partial<LyricLine>) => void;
	onDeleteLine: (id: number) => void;
	onJumpToLine: (id: number) => void;
	onSetCurrentTime: (id: number) => void;
	onAddLine: () => void;
}) {
	return (
		<div>
			<div className="space-y-3">
				{lyricLines.map((line, index) => (
					<LyricLineItem
						key={line.id}
						line={line}
						index={index}
						canUseCurrentTime={canUseCurrentTime(index)}
						onUpdateLine={onUpdateLine}
						onDeleteLine={onDeleteLine}
						onJumpToLine={onJumpToLine}
						onSetCurrentTime={onSetCurrentTime}
					/>
				))}
			</div>

			<div className="flex justify-center mt-6 gap-3">
				<Button onClick={onAddLine} variant="outline" className="gap-2">
					<PlusCircle className="h-4 w-4" />
					Add Line
				</Button>
			</div>
		</div>
	);
}
