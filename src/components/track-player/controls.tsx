import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { useTrackPlayerStore } from '@/stores/track-player/store';
import { useShallow } from 'zustand/react/shallow';

export type AudioPlayerState = {
	isPlaying: boolean;
	duration: number;
	currentTime: number;
	volume: number;
	isMuted: boolean;
};

// Play/Pause Button component
const PlayPauseButton = () => {
	const { isPlaying, playPause } = useTrackPlayerStore(
		useShallow((state) => ({
			isPlaying: state.isPlaying,
			playPause: state.playPause,
		}))
	);

	return (
		<Button
			variant="outline"
			size="icon"
			className="h-9 w-9 rounded-full"
			onClick={playPause}
		>
			{isPlaying ? (
				<Pause className="h-4 w-4" />
			) : (
				<Play className="h-4 w-4" />
			)}
		</Button>
	);
};

// Time Display component
// Time Display component
const TimeDisplay = ({
	type = 'current',
	className = '',
}: {
	type?: 'current' | 'duration';
	className?: string;
}) => {
	const { currentTime, duration } = useTrackPlayerStore(
		useShallow((state) => ({
			currentTime: state.currentTime,
			duration: state.duration,
		}))
	);

	const time = type === 'current' ? currentTime : duration;

	const formatTime = (time: number) => {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
	};

	return (
		<span className={`text-xs text-muted-foreground ${className}`}>
			{formatTime(time)}
		</span>
	);
};

// Progress Slider component
const ProgressSlider = () => {
	const { currentTime, duration, setTime } = useTrackPlayerStore(
		useShallow((state) => ({
			currentTime: state.currentTime,
			duration: state.duration,
			setTime: state.setTime,
		}))
	);

	return (
		<Slider
			value={[currentTime]}
			min={0}
			max={duration || 100}
			step={0.1}
			onValueChange={(values) => setTime(values[0])}
			className="hover:cursor-pointer"
		/>
	);
};

// Volume Button component
const VolumeButton = () => {
	const { isMuted, toggleMute } = useTrackPlayerStore(
		useShallow((state) => ({
			isMuted: state.isMuted,
			toggleMute: state.toggleMute,
		}))
	);

	return (
		<Button
			variant="ghost"
			size="icon"
			className="h-8 w-8"
			onClick={toggleMute}
		>
			{isMuted ? (
				<VolumeX className="h-4 w-4" />
			) : (
				<Volume2 className="h-4 w-4" />
			)}
		</Button>
	);
};

// Volume Slider component
const VolumeSlider = () => {
	const { volume, isMuted, setVolume } = useTrackPlayerStore(
		useShallow((state) => ({
			volume: state.volume,
			isMuted: state.isMuted,
			setVolume: state.setVolume,
		}))
	);

	return (
		<Slider
			value={[isMuted ? 0 : volume]}
			min={0}
			max={1}
			step={0.01}
			onValueChange={(values) => setVolume(values[0])}
			className="w-20"
		/>
	);
};

// Main Controls component
export const Controls = () => {
	return (
		<div className="mb-3 flex items-center gap-2">
			<PlayPauseButton />
			<TimeDisplay className="w-10" />

			<div className="flex-1">
				<ProgressSlider />
			</div>

			<TimeDisplay className="w-10" />
			<VolumeButton />
			<VolumeSlider />
		</div>
	);
};
