import { downloadAudioFile } from '@/data/api';
import { Button } from './ui/button';
import { useRef, useState, useEffect } from 'react';
import { Download, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Slider } from './ui/slider';

export function TrackPlayer({
	title,
	icon: Icon,
	iconColor,
	src,
}: {
	title: string;
	icon: React.ComponentType<any>;
	iconColor: string;
	src: string;
}) {
	const audioRef = useRef<HTMLAudioElement>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const [volume, setVolume] = useState(1);
	const [isMuted, setIsMuted] = useState(false);
	const [waveBars, setWaveBars] = useState<number[]>([]);

	useEffect(() => {
		// Generate random waveform pattern
		const bars = Array.from(
			{ length: 50 },
			() => Math.random() * 0.8 + 0.2
		);
		setWaveBars(bars);

		const audio = audioRef.current;
		if (!audio) return;

		const updateDuration = () => setDuration(audio.duration);
		const updateTime = () => setCurrentTime(audio.currentTime);

		audio.addEventListener('loadedmetadata', updateDuration);
		audio.addEventListener('timeupdate', updateTime);
		audio.addEventListener('ended', () => setIsPlaying(false));

		return () => {
			audio.removeEventListener('loadedmetadata', updateDuration);
			audio.removeEventListener('timeupdate', updateTime);
			audio.removeEventListener('ended', () => setIsPlaying(false));
		};
	}, []);

	const togglePlayPause = () => {
		if (audioRef.current) {
			if (isPlaying) {
				audioRef.current.pause();
			} else {
				audioRef.current.play();
			}
			setIsPlaying(!isPlaying);
		}
	};

	const handleTimeChange = (value: number[]) => {
		const newTime = value[0];
		setCurrentTime(newTime);
		if (audioRef.current) {
			audioRef.current.currentTime = newTime;
		}
	};

	const handleVolumeChange = (value: number[]) => {
		const newVolume = value[0];
		setVolume(newVolume);
		if (audioRef.current) {
			audioRef.current.volume = newVolume;
		}
	};

	const toggleMute = () => {
		if (audioRef.current) {
			audioRef.current.muted = !isMuted;
			setIsMuted(!isMuted);
		}
	};

	const formatTime = (time: number) => {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
	};

	return (
		<div className="rounded-lg border bg-card p-5 shadow-sm transition-all hover:shadow-md">
			<div className="mb-4 flex items-center justify-between">
				<h3 className="flex items-center gap-2 font-semibold">
					<Icon className={`h-5 w-5 ${iconColor}`} />
					{title}
				</h3>
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 rounded-full"
					onClick={() => downloadAudioFile(src)}
					title="Download track"
				>
					<Download className="h-4 w-4" />
				</Button>
			</div>

			<audio ref={audioRef} src={src} className="hidden" />

			<div className="mb-4 flex h-16 items-center gap-0.5">
				{waveBars.map((height, index) => (
					<div
						key={index}
						className={cn(
							'h-full w-full transition-all duration-300',
							index <
								waveBars.length * (currentTime / duration || 0)
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
					/>
				))}
			</div>

			<div className="mb-3 flex items-center gap-2">
				<Button
					variant="outline"
					size="icon"
					className="h-9 w-9 rounded-full"
					onClick={togglePlayPause}
				>
					{isPlaying ? (
						<Pause className="h-4 w-4" />
					) : (
						<Play className="h-4 w-4" />
					)}
				</Button>

				<span className="w-10 text-xs text-muted-foreground">
					{formatTime(currentTime)}
				</span>

				<Slider
					value={[currentTime]}
					min={0}
					max={duration || 100}
					step={0.1}
					onValueChange={handleTimeChange}
					className="flex-1"
				/>

				<span className="w-10 text-xs text-muted-foreground">
					{formatTime(duration)}
				</span>

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

				<Slider
					value={[isMuted ? 0 : volume]}
					min={0}
					max={1}
					step={0.01}
					onValueChange={handleVolumeChange}
					className="w-20"
				/>
			</div>
		</div>
	);
}
