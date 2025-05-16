import { useEffect } from 'react';
import { Music, X } from 'lucide-react';
import { TrackPlayer } from './track-player';
import { Button } from './ui/button';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from './ui/alert-dialog';
import { useTrackUploadStore } from '@/stores/track-upload-wrapper/store';
import { useAudioRef } from '@/hooks/use-audio-ref';
import { useLyricStudioStore } from '@/stores/lyric-studio/store';
import { useShallow } from 'zustand/react/shallow';
import { DropZone } from './track-upload-wrapper/drop-zone';

interface TrackUploadWrapperProps {
	iconColor?: string;
	showDownload?: boolean;
}

export function TrackUploadWrapper({
	iconColor = 'text-primary',
	showDownload = false,
}: TrackUploadWrapperProps) {
	const { audioFile, audioUrl, setShowConfirmDialog } = useTrackUploadStore(
		useShallow((state) => ({
			audioFile: state.audioFile,
			audioUrl: state.audioUrl,
			showConfirmDialog: state.showConfirmDialog,
			setShowConfirmDialog: state.setShowConfirmDialog,
			handleRemoveAudio: state.handleRemoveAudio,
		}))
	);

	// Clean up object URL on unmount
	useEffect(() => {
		return () => {
			if (audioUrl) {
				URL.revokeObjectURL(audioUrl);
			}
		};
	}, [audioUrl]);

	if (!audioFile || !audioUrl) {
		return <DropZone />;
	}

	return (
		<div className="relative w-full max-w-xl mx-auto">
			<Button
				size="icon"
				variant="ghost"
				className="absolute -right-8 -top-4 z-10 h-8 w-8 rounded-full bg-background shadow-md hover:cursor-pointer text-muted-foreground hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-destructive"
				onClick={() => setShowConfirmDialog(true)}
				title="Remove audio"
			>
				<X className="h-4 w-4" />
			</Button>
			<TrackPlayer
				icon={Music}
				iconColor={iconColor}
				showDownload={showDownload}
			/>

			<ConfirmRemoveCurrentTrackDialog />
		</div>
	);
}

const ConfirmRemoveCurrentTrackDialog = () => {
	const audioRef = useAudioRef();
	const { showConfirmDialog, setShowConfirmDialog, handleRemoveAudio } =
		useTrackUploadStore(
			useShallow((state) => ({
				audioFile: state.audioFile,
				audioUrl: state.audioUrl,
				showConfirmDialog: state.showConfirmDialog,
				setShowConfirmDialog: state.setShowConfirmDialog,
				handleRemoveAudio: state.handleRemoveAudio,
			}))
		);
	return (
		<AlertDialog
			open={showConfirmDialog}
			onOpenChange={setShowConfirmDialog}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Remove track?</AlertDialogTitle>
					<AlertDialogDescription>
						This action will remove the current audio track.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={() =>
							handleRemoveAudio(audioRef, () =>
								useLyricStudioStore().setTrackLoaded(false)
							)
						}
					>
						Remove
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
