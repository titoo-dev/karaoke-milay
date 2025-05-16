import { useRef, useEffect } from 'react';
import { Controls } from './track-player/controls';
import { Waveform } from './track-player/wave-form';
import { useTrackPlayerStore } from '@/stores/track-player/store';
import { useAudioRef } from '@/hooks/use-audio-ref';
import { WaveFormToggleButton } from './track-player/wave-form-toggle-button';
import { DownloadAudioFileButton } from './track-player/download-audio-file-button';
import { useShallow } from 'zustand/react/shallow';
import { useTrackUploadStore } from '@/stores/track-upload-wrapper/store';

type TrackPlayerProps = {
	icon: React.ComponentType<any>;
	iconColor: string;
	showDownload?: boolean;
};

export function TrackPlayer({
	icon: Icon,
	iconColor,
	showDownload = true,
}: TrackPlayerProps) {
	const { audioFile, audioUrl } = useTrackUploadStore();
	const playerRef = useRef<HTMLDivElement>(null);
	const audioRef = useAudioRef();

	const { initializeAudio, playPause } = useTrackPlayerStore(
		useShallow((state) => ({
			initializeAudio: state.initializeAudio,
			playPause: state.playPause,
		}))
	);

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

	if (!audioFile || !audioUrl) return null;

	return (
		<div
			className="rounded-lg border bg-card p-5"
			ref={playerRef}
			tabIndex={0}
		>
			<div className="mb-4 flex items-center justify-between">
				<h3 className="flex items-center gap-2 font-semibold">
					<Icon className={`h-5 w-5 ${iconColor}`} />
					{audioFile.name}
				</h3>
				<div className="flex items-center gap-2">
					<WaveFormToggleButton />

					<DownloadAudioFileButton
						src={audioUrl}
						showDownload={showDownload}
					/>
				</div>
			</div>

			<audio ref={audioRef} src={audioUrl} className="hidden" />

			<Waveform />

			<Controls />
		</div>
	);
}
