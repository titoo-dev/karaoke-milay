import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { useLyricStudioStore } from '@/stores/lyric-studio/store';
import { useTrackPlayerStore } from '@/stores/track-player/store';
import { useAudioRef } from '@/hooks/use-audio-ref';

export function LyricsPreviewCard() {
	const lyricLines = useLyricStudioStore((state) => state.lyricLines);
	const currentTime = useTrackPlayerStore((state) => state.currentTime);
	const [activeLyricId, setActiveLyricId] = useState<number | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const activeLineRef = useRef<HTMLDivElement>(null);
	const audioRef = useAudioRef();

	// Find the active lyric based on current time
	useEffect(() => {
		if (!lyricLines.length) return;

		// Sort lyricLines by timestamp
		const sortedLyrics = [...lyricLines].sort(
			(a, b) => a.timestamp - b.timestamp
		);

		// Find the last lyric whose timestamp is less than or equal to current time
		let activeIndex = -1;
		for (let i = 0; i < sortedLyrics.length; i++) {
			if (sortedLyrics[i].timestamp <= currentTime) {
				activeIndex = i;
			} else {
				break;
			}
		}

		setActiveLyricId(
			activeIndex >= 0 ? sortedLyrics[activeIndex].id : null
		);
	}, [lyricLines, currentTime]);

	// Scroll to active lyric
	useEffect(() => {
		if (activeLyricId && activeLineRef.current && containerRef.current) {
			activeLineRef.current.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
			});
		}
	}, [activeLyricId]);

	// If no lyrics, show a placeholder
	if (!lyricLines.length) {
		return (
			<div className="flex items-center justify-center h-60 text-muted-foreground">
				No lyrics to preview
			</div>
		);
	}

	// Sort lyricLines by timestamp for display
	const sortedLyrics = [...lyricLines].sort(
		(a, b) => a.timestamp - b.timestamp
	);

	const jumpToLyricLine = (id: number) => {
		const line = lyricLines.find((line) => line.id === id);
		if (line && audioRef.current) {
			audioRef.current.currentTime = line.timestamp;
			audioRef.current
				.play()
				.catch((err) => console.error('Playback failed:', err));
		}
	};

	return (
		<div className="lyrics-preview-container bg-background/50 backdrop-blur-sm p-6 overflow-hidden relative">
			<div className="lyrics-preview-gradient" />

			<div className="flex flex-col items-center justify-center h-full relative">
				<AnimatePresence>
					{sortedLyrics.map((line) => {
						const isActive = line.id === activeLyricId;

						return (
							<motion.div
								key={line.id}
								ref={isActive ? activeLineRef : undefined}
								className={cn(
									'cursor-pointer text-center py-2 px-4 my-1 transition-all duration-300 rounded-lg',
									isActive
										? 'lyrics-preview-active'
										: 'opacity-60 hover:opacity-90'
								)}
								initial={{ opacity: 0, y: 20 }}
								animate={{
									opacity: isActive ? 1 : 0.6,
									y: 0,
									scale: isActive ? 1.15 : 1,
									transition: { duration: 0.3 },
								}}
								exit={{ opacity: 0, y: -20 }}
								onClick={() => jumpToLyricLine(line.id)}
								style={{
									position: 'relative',
									zIndex: isActive ? 2 : 1,
								}}
							>
								<span
									className={cn(
										isActive ? 'text-lg' : 'text-base'
									)}
								>
									{line.text || '(Empty lyric)'}
								</span>
							</motion.div>
						);
					})}
				</AnimatePresence>
			</div>
		</div>
	);
}
