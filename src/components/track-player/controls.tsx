import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { useTrackPlayerStore } from '@/stores/track-player/store';
import { useShallow } from 'zustand/react/shallow';
import { motion } from 'motion/react';
import { useAudioRef } from '@/hooks/use-audio-ref';

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
const CurrentTimeDisplay = ({ className = '' }: { className?: string }) => {
	const currentTime = useTrackPlayerStore((state) => state.currentTime);

	const formatTime = (time: number) => {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
	};

	return (
		<span className={`text-xs text-muted-foreground ${className}`}>
			{formatTime(currentTime)}
		</span>
	);
};

const DurationTimeDisplay = ({ className = '' }: { className?: string }) => {
	const duration = useTrackPlayerStore((state) => state.duration);

	const formatTime = (time: number) => {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
	};

	return (
		<span className={`text-xs text-muted-foreground ${className}`}>
			{formatTime(duration)}
		</span>
	);
};

// Progress Slider component
const ProgressSlider = () => {
	const audioRef = useAudioRef();

	const { currentTime, duration } = useTrackPlayerStore(
		useShallow((state) => ({
			currentTime: state.currentTime,
			duration: state.duration,
			setTime: state.setTime,
		}))
	);

	const handlePositionChange = (value: number[]) => {
		if (audioRef.current) {
			audioRef.current.currentTime = value[0];
		}
	};

	return (
		<motion.div
			whileHover={{
				scaleY: 2,
				backfaceVisibility: 'hidden',
			}}
		>
			<Slider
				value={[currentTime]}
				min={0}
				max={duration || 100}
				onValueChange={handlePositionChange}
				className="w-full will-change-transform"
			/>
		</motion.div>
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
			<CurrentTimeDisplay className="w-10" />

			<div className="flex-1">
				<ProgressSlider />
			</div>

			<DurationTimeDisplay className="w-10" />
			<VolumeButton />
			<VolumeSlider />
		</div>
	);
};
