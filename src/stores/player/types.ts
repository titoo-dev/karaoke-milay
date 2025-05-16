export type Track = {
	src: string;
};

export interface PlayerStateProperties {
	src?: string;
	volume: number;
	position: number;
	isPlaying: boolean;
	duration: number;
	muted: boolean;
}

export interface PlayerStateActions {
	setSrc: (src: string) => void;
	setPosition: (position: number) => void;
	setIsPlaying: (isPlaying: boolean) => void;
	setDuration: (duration: number) => void;
	play: () => void;
	pause: () => void;
	toggle: () => void;
	setVolume: (volume: number) => void;
	setMuted: (muted: boolean) => void;
}

export type PlayerState = PlayerStateProperties & PlayerStateActions;
