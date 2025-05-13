import { downloadAudioFile } from '@/data/api';
import { Button } from './ui/button';
import { useRef, useState, useEffect } from 'react';
import { Download, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Slider } from './ui/slider';

type AudioPlayerState = {
	isPlaying: boolean;
	duration: number;
	currentTime: number;
	volume: number;
	isMuted: boolean;
};

type TrackPlayerProps = {
	title: string;
	icon: React.ComponentType<any>;
	iconColor: string;
	src: string;
	showDownload?: boolean;
};

type WaveformProps = {
	bars: number[];
	currentTime: number;
	duration: number;
	isPlaying: boolean;
	onBarClick: (index: number) => void;
};

type ControlsProps = {
	audioState: AudioPlayerState;
	onPlayPause: () => void;
	onTimeChange: (value: number[]) => void;
	onVolumeChange: (value: number[]) => void;
	onMuteToggle: () => void;
};

const Waveform = ({
	bars,
	currentTime,
	duration,
	isPlaying,
	onBarClick,
}: WaveformProps) => (
	<div className="mb-4 flex h-16 items-center gap-0.5">
		{bars.map((height, index) => (
			<div
				key={index}
				className={cn(
					'h-full w-full transition-all duration-300 hover:opacity-70 cursor-pointer',
					index < bars.length * (currentTime / duration || 0)
						? 'bg-primary'
						: 'bg-muted'
				)}
				style={{
					height: `${height * 100}%`,
					opacity:
						isPlaying &&
						index ===
							Math.floor(
								bars.length * (currentTime / duration || 0)
							)
							? '0.8'
							: undefined,
				}}
				onClick={() => onBarClick(index)}
			/>
		))}
	</div>
);

const Controls = ({
	audioState,
	onPlayPause,
	onTimeChange,
	onVolumeChange,
	onMuteToggle,
}: ControlsProps) => {
	const formatTime = (time: number) => {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
	};

	return (
		<div className="mb-3 flex items-center gap-2">
			<Button
				variant="outline"
				size="icon"
				className="h-9 w-9 rounded-full"
				onClick={onPlayPause}
			>
				{audioState.isPlaying ? (
					<Pause className="h-4 w-4" />
				) : (
					<Play className="h-4 w-4" />
				)}
			</Button>

			<span className="w-10 text-xs text-muted-foreground">
				{formatTime(audioState.currentTime)}
			</span>

			<div className="flex-1">
				<Slider
					value={[audioState.currentTime]}
					min={0}
					max={audioState.duration || 100}
					step={0.1}
					onValueChange={onTimeChange}
					className="hover:cursor-pointer"
				/>
			</div>

			<span className="w-10 text-xs text-muted-foreground">
				{formatTime(audioState.duration)}
			</span>

			<Button
				variant="ghost"
				size="icon"
				className="h-8 w-8"
				onClick={onMuteToggle}
			>
				{audioState.isMuted ? (
					<VolumeX className="h-4 w-4" />
				) : (
					<Volume2 className="h-4 w-4" />
				)}
			</Button>

			<Slider
				value={[audioState.isMuted ? 0 : audioState.volume]}
				min={0}
				max={1}
				step={0.01}
				onValueChange={onVolumeChange}
				className="w-20"
			/>
		</div>
	);
};

export function TrackPlayer({
	title,
	icon: Icon,
	iconColor,
	src,
	showDownload = true,
}: TrackPlayerProps) {
	const audioRef = useRef<HTMLAudioElement>(null);
	const [waveBars] = useState(() =>
		Array.from({ length: 50 }, () => Math.random() * 0.8 + 0.2)
	);
	const [audioState, setAudioState] = useState<AudioPlayerState>({
		isPlaying: false,
		duration: 0,
		currentTime: 0,
		volume: 1,
		isMuted: false,
	});

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const handlers = {
			loadedmetadata: () =>
				setAudioState((s) => ({ ...s, duration: audio.duration })),
			timeupdate: () =>
				setAudioState((s) => ({
					...s,
					currentTime: audio.currentTime,
				})),
			ended: () => setAudioState((s) => ({ ...s, isPlaying: false })),
		};

		Object.entries(handlers).forEach(([event, handler]) => {
			audio.addEventListener(event, handler);
		});

		return () => {
			Object.entries(handlers).forEach(([event, handler]) => {
				audio?.removeEventListener(event, handler);
			});
		};
	}, []);

	const handlePlayPause = () => {
		if (audioRef.current) {
			if (audioState.isPlaying) {
				audioRef.current.pause();
			} else {
				audioRef.current.play();
			}
			setAudioState((s) => ({ ...s, isPlaying: !s.isPlaying }));
		}
	};

	const handleTimeChange = (value: number[]) => {
		const newTime = value[0];
		if (audioRef.current) {
			audioRef.current.currentTime = newTime;
			setAudioState((s) => ({ ...s, currentTime: newTime }));
		}
	};

	const handleVolumeChange = (value: number[]) => {
		const newVolume = value[0];
		if (audioRef.current) {
			audioRef.current.volume = newVolume;
			setAudioState((s) => ({ ...s, volume: newVolume }));
		}
	};

	const handleMuteToggle = () => {
		if (audioRef.current) {
			audioRef.current.muted = !audioState.isMuted;
			setAudioState((s) => ({ ...s, isMuted: !s.isMuted }));
		}
	};

	const handleWaveBarClick = (index: number) => {
		if (audioRef.current && audioState.duration) {
			const newTime = (index / waveBars.length) * audioState.duration;
			handleTimeChange([newTime]);
		}
	};

	return (
		<div className="rounded-lg border bg-card p-5">
			<div className="mb-4 flex items-center justify-between">
				<h3 className="flex items-center gap-2 font-semibold">
					<Icon className={`h-5 w-5 ${iconColor}`} />
					{title}
				</h3>
				{showDownload && (
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 rounded-full"
						onClick={() => downloadAudioFile(src)}
						title="Download track"
					>
						<Download className="h-4 w-4" />
					</Button>
				)}
			</div>

			<audio ref={audioRef} src={src} className="hidden" />

			<Waveform
				bars={waveBars}
				currentTime={audioState.currentTime}
				duration={audioState.duration}
				isPlaying={audioState.isPlaying}
				onBarClick={handleWaveBarClick}
			/>

			<Controls
				audioState={audioState}
				onPlayPause={handlePlayPause}
				onTimeChange={handleTimeChange}
				onVolumeChange={handleVolumeChange}
				onMuteToggle={handleMuteToggle}
			/>
		</div>
	);
}
