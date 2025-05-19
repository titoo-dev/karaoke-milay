import type { LyricLine } from '@/components/lyric-studio/lyric-line-item';
import {
	createContext,
	useRef,
	useState,
	type ComponentRef,
	type ReactNode,
	type RefObject,
} from 'react';

type AppContextType = {
	trackLoaded: boolean;
	setTrackLoaded: (loaded: boolean) => void;
	audioRef: RefObject<ComponentRef<'audio'> | null>;
	jumpToLyricLine: (id: number) => void;
	lyricLines: LyricLine[];
	setLyricLines: (lines: LyricLine[]) => void;
	externalLyrics: string;
	setExternalLyrics: (lyrics: string) => void;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
	const audioRef = useRef<ComponentRef<'audio'>>(null);
	const [externalLyrics, setExternalLyrics] = useState<string>('');
	const [lyricLines, setLyricLines] = useState<LyricLine[]>([]);
	const [trackLoaded, setTrackLoaded] = useState(false);

	// Jump to timestamp of specific lyric line
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
		<AppContext.Provider
			value={{
				audioRef,
				trackLoaded,
				setTrackLoaded,
				jumpToLyricLine,
				lyricLines,
				setLyricLines,
				externalLyrics,
				setExternalLyrics,
			}}
		>
			{children}
		</AppContext.Provider>
	);
}
