import { downloadAudioFile } from '@/data/api';
import { Button } from './ui/button';
import { useRef, useEffect } from 'react';
import { Download, AudioLines } from 'lucide-react';
import { Controls } from './track-player/controls';
import { Waveform } from './track-player/wave-form';
import { useTrackPlayerStore } from '@/stores/track-player/store';
import { useAudioRef } from '@/hooks/use-audio-ref';

type TrackPlayerProps = {
	title: string;
	icon: React.ComponentType<any>;
	iconColor: string;
	src: string;
	showDownload?: boolean;
};

export function TrackPlayer({
	title,
	icon: Icon,
	iconColor,
	src,
	showDownload = true,
}: TrackPlayerProps) {
	const playerRef = useRef<HTMLDivElement>(null);
	const audioRef = useAudioRef();

	const {
		isPlaying,
		duration,
		currentTime,
		volume,
		isMuted,
		isWaveformVisible,
		waveBars,
		initializeAudio,
		setTime,
		playPause,
		setVolume,
		toggleMute,
		toggleWaveform,
	} = useTrackPlayerStore();

	// Initialize audio when component mounts
	useEffect(() => {
		if (audioRef.current) {
			initializeAudio(audioRef.current);
		}
	}, [initializeAudio]);

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (
				e.code === 'Space' &&
				playerRef.current &&
				(playerRef.current.contains(document.activeElement) ||
					document.activeElement === document.body)
			) {
				e.preventDefault();
				playPause();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [playPause]);

	const handleTimeChange = (value: number[]) => {
		setTime(value[0]);
	};

	const handleVolumeChange = (value: number[]) => {
		setVolume(value[0]);
	};

	const handleWaveBarClick = (index: number) => {
		if (duration) {
			const newTime = (index / waveBars.length) * duration;
			setTime(newTime);
		}
	};

	return (
		<div
			className="rounded-lg border bg-card p-5"
			ref={playerRef}
			tabIndex={0}
		>
			<div className="mb-4 flex items-center justify-between">
				<h3 className="flex items-center gap-2 font-semibold">
					<Icon className={`h-5 w-5 ${iconColor}`} />
					{title}
				</h3>
				<div className="flex items-center gap-2">
					<Button
						variant={isWaveformVisible ? 'default' : 'ghost'}
						size="icon"
						className="h-8 w-8 rounded-full"
						onClick={toggleWaveform}
						title={
							isWaveformVisible
								? 'Hide waveform'
								: 'Show waveform'
						}
					>
						<AudioLines className="h-4 w-4" />
					</Button>
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
			</div>

			<audio ref={audioRef} src={src} className="hidden" />

			{isWaveformVisible && (
				<Waveform
					bars={waveBars}
					currentTime={currentTime}
					duration={duration}
					isPlaying={isPlaying}
					onBarClick={handleWaveBarClick}
				/>
			)}

			<Controls
				audioState={{
					isPlaying,
					duration,
					currentTime,
					volume,
					isMuted,
				}}
				onPlayPause={playPause}
				onTimeChange={handleTimeChange}
				onVolumeChange={handleVolumeChange}
				onMuteToggle={toggleMute}
			/>
		</div>
	);
}
