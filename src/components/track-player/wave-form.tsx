import { cn } from '@/lib/utils';
import { useTrackPlayerStore } from '@/stores/track-player/store';

export const Waveform = () => {
	const {
		waveBars,
		currentTime,
		duration,
		isPlaying,
		setTime,
		isWaveformVisible,
	} = useTrackPlayerStore();

	if (!isWaveformVisible) return null;

	const handleWaveBarClick = (index: number) => {
		if (duration) {
			const newTime = (index / waveBars.length) * duration;
			setTime(newTime);
		}
	};

	return (
		<div className="mb-4 flex h-16 items-center gap-0.5">
			{waveBars.map((height, index) => (
				<div
					key={index}
					className={cn(
						'h-full w-full transition-all duration-300 hover:opacity-70 cursor-pointer',
						index < waveBars.length * (currentTime / duration || 0)
							? 'bg-primary'
							: 'bg-muted'
					)}
					style={{
						height: `${height * 100}%`,
						opacity:
							isPlaying &&
							index ===
								Math.floor(
									waveBars.length *
										(currentTime / duration || 0)
								)
								? '0.8'
								: undefined,
					}}
					onClick={() => handleWaveBarClick(index)}
				/>
			))}
		</div>
	);
};
