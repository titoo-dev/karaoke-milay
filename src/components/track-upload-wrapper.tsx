import { useRef, useEffect } from 'react';
import { Music, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
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

interface TrackUploadWrapperProps {
	iconColor?: string;
	showDownload?: boolean;
}

export function TrackUploadWrapper({
	iconColor = 'text-primary',
	showDownload = false,
}: TrackUploadWrapperProps) {
	const { setTrackLoaded } = useLyricStudioStore();
	const {
		audioFile,
		audioUrl,
		isDragging,
		showConfirmDialog,
		setShowConfirmDialog,
		handleFileChange,
		handleRemoveAudio,
		handleDrop,
		handleDragOver,
		handleDragLeave,
		handleDragEnter,
	} = useTrackUploadStore();
	const audioRef = useAudioRef();
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Clean up object URL on unmount
	useEffect(() => {
		return () => {
			if (audioUrl) {
				URL.revokeObjectURL(audioUrl);
			}
		};
	}, [audioUrl]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			handleFileChange(file);
		}
	};

	const handleBrowseClick = () => {
		fileInputRef.current?.click();
	};

	if (!audioFile || !audioUrl) {
		return (
			<div
				className={cn(
					'w-full max-w-xl mx-auto p-6 rounded-xl transition-all duration-200',
					'border-2 border-dashed flex flex-col items-center justify-center',
					'bg-card hover:bg-muted/30',
					isDragging
						? 'border-primary border-opacity-70 bg-primary/5'
						: 'border-muted-foreground/20'
				)}
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDragOver={handleDragOver}
				onDrop={(e) => handleDrop(e, () => setTrackLoaded(true))}
			>
				<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
					<Upload className="h-8 w-8 text-primary" />
				</div>
				<h3 className="text-lg font-medium mb-2">Add your track</h3>
				<p className="text-sm text-muted-foreground text-center mb-4">
					Drag and drop an audio file or browse to upload
				</p>
				<input
					type="file"
					ref={fileInputRef}
					className="hidden"
					accept="audio/*"
					onChange={handleInputChange}
				/>
				<Button
					variant="outline"
					className="mt-2"
					onClick={handleBrowseClick}
				>
					Browse Files
				</Button>
				<p className="text-xs text-muted-foreground mt-4">
					Supports MP3, WAV, OGG, FLAC
				</p>
			</div>
		);
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
				title={audioFile.name}
				icon={Music}
				iconColor={iconColor}
				src={audioUrl}
				showDownload={showDownload}
			/>

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
									setTrackLoaded(false)
								)
							}
						>
							Remove
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
