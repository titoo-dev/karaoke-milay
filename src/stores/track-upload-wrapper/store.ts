import { create } from 'zustand';
import { useEffect } from 'react';

// filepath: /home/titos/dev/karaoke-milay/src/stores/track-upload-wrapper/store.ts

interface TrackUploadState {
	audioFile: File | null;
	audioUrl: string | null;
	isDragging: boolean;
	showConfirmDialog: boolean;

	// Actions
	setIsDragging: (isDragging: boolean) => void;
	setShowConfirmDialog: (show: boolean) => void;
	handleFileChange: (file: File) => void;
	handleRemoveAudio: (
		audioRef: React.RefObject<HTMLAudioElement | null>,
		onAudioRemove?: () => void
	) => void;

	// Handlers
	handleDragEnter: (e: React.DragEvent) => void;
	handleDragLeave: (e: React.DragEvent) => void;
	handleDragOver: (e: React.DragEvent) => void;
	handleDrop: (e: React.DragEvent, onAudioLoad?: () => void) => void;
}

export const useTrackUploadStore = create<TrackUploadState>((set, get) => ({
	audioFile: null,
	audioUrl: null,
	isDragging: false,
	showConfirmDialog: false,

	setIsDragging: (isDragging) => set({ isDragging }),
	setShowConfirmDialog: (show) => set({ showConfirmDialog: show }),

	handleFileChange: (file) => {
		const { audioUrl } = get();

		// Revoke previous URL if it exists
		if (audioUrl) {
			URL.revokeObjectURL(audioUrl);
		}

		const url = URL.createObjectURL(file);
		set({ audioFile: file, audioUrl: url });
	},

	handleRemoveAudio: (audioRef, onAudioRemove) => {
		const { audioUrl } = get();

		if (audioUrl) {
			URL.revokeObjectURL(audioUrl);
		}

		set({ audioFile: null, audioUrl: null });

		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.src = '';
		}

		if (onAudioRemove) {
			onAudioRemove();
		}
	},

	handleDragEnter: (e) => {
		e.preventDefault();
		e.stopPropagation();
		set({ isDragging: true });
	},

	handleDragLeave: (e) => {
		e.preventDefault();
		e.stopPropagation();
		set({ isDragging: false });
	},

	handleDragOver: (e) => {
		e.preventDefault();
		e.stopPropagation();
		const { isDragging } = get();
		if (!isDragging) {
			set({ isDragging: true });
		}
	},

	handleDrop: (e, onAudioLoad) => {
		e.preventDefault();
		e.stopPropagation();
		set({ isDragging: false });

		const file = e.dataTransfer.files?.[0];
		if (file && file.type.startsWith('audio/')) {
			get().handleFileChange(file);
			if (onAudioLoad) {
				onAudioLoad();
			}
		}
	},
}));

// Hook to handle cleanup when component unmounts
export const useAudioUrlCleanup = (audioUrl: string | null) => {
	useEffect(() => {
		return () => {
			if (audioUrl) {
				URL.revokeObjectURL(audioUrl);
			}
		};
	}, [audioUrl]);
};
