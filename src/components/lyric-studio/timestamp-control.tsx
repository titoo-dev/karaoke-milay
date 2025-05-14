import { formatTimestamp } from '@/lib/utils';

// Component for the timestamp control
interface TimestampControlProps {
	timestamp: number;
	lineId: number;
	canSetCurrentTime: boolean;
	onJumpToTimestamp: (id: number) => void;
	onSetCurrentTime: (id: number) => void;
}

export function TimestampControl({
	timestamp,
	lineId,
	canSetCurrentTime,
	onJumpToTimestamp,
	onSetCurrentTime,
}: TimestampControlProps) {
	return (
		<div className="flex items-center gap-2 rounded-lg border bg-background/50 backdrop-blur-sm p-2">
			<button
				onClick={() => onJumpToTimestamp(lineId)}
				className="flex items-center gap-2 hover:bg-primary/10 hover:cursor-pointer rounded-sm px-2 py-2 transition-colors"
				title="Jump to this timestamp"
			>
				<span className="w-20 text-center text-sm font-mono">
					{formatTimestamp(timestamp)}
				</span>
			</button>

			<button
				onClick={() => onSetCurrentTime(lineId)}
				className={`p-1.5 rounded-md ${
					canSetCurrentTime
						? 'hover:bg-primary/10 text-primary'
						: 'text-muted-foreground cursor-not-allowed opacity-50'
				}`}
				title={
					canSetCurrentTime
						? 'Set current time as timestamp'
						: 'Current time would break the ascending sequence'
				}
				disabled={!canSetCurrentTime}
			>
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M9 4H5C4.44772 4 4 4.44772 4 5V9"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M15 4H19C19.5523 4 20 4.44772 20 5V9"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M9 20H5C4.44772 20 4 19.5523 4 19V15"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M15 20H19C19.5523 20 20 19.5523 20 19V15"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<circle
						cx="12"
						cy="12"
						r="3"
						stroke="currentColor"
						strokeWidth="2"
					/>
				</svg>
			</button>
		</div>
	);
}
