import { createContext, useRef, type ReactNode, type RefObject } from 'react';

export const AudioContext =
	createContext<RefObject<HTMLAudioElement | null> | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
	const audioRef = useRef<HTMLAudioElement>(null);
	return (
		<AudioContext.Provider value={audioRef}>
			{children}
		</AudioContext.Provider>
	);
}
