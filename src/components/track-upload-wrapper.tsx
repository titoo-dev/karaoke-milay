import { useState, useRef, useEffect } from 'react';
import { Music, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TrackPlayer } from './track-player';
import { Button } from './ui/button';

interface TrackUploadWrapperProps {
	audioRef: React.RefObject<HTMLAudioElement>;
	iconColor?: string;
	showDownload?: boolean;
	onAudioLoad?: () => void;
	onAudioRemove?: () => void;
}

export function TrackUploadWrapper({
	audioRef,
	iconColor = 'text-primary',
	showDownload = false,
	onAudioLoad,
	onAudioRemove,
}: TrackUploadWrapperProps) {
	const [audioFile, setAudioFile] = useState<File | null>(null);
	const [audioUrl, setAudioUrl] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Clean up object URL on unmount
	useEffect(() => {
		return () => {
			if (audioUrl) {
				URL.revokeObjectURL(audioUrl);
			}
		};
	}, [audioUrl]);

	const handleFileChange = (file: File) => {
		// Revoke previous URL if it exists
		if (audioUrl) {
			URL.revokeObjectURL(audioUrl);
		}

		setAudioFile(file);
		const url = URL.createObjectURL(file);
		setAudioUrl(url);

		// Call the onAudioLoad callback if provided
		if (onAudioLoad) {
			onAudioLoad();
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			handleFileChange(file);
		}
	};

	const handleDragEnter = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (!isDragging) {
			setIsDragging(true);
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);

		const file = e.dataTransfer.files?.[0];
		if (file && file.type.startsWith('audio/')) {
			handleFileChange(file);
		}
	};

	const handleRemoveAudio = () => {
		if (audioUrl) {
			URL.revokeObjectURL(audioUrl);
		}
		setAudioFile(null);
		setAudioUrl(null);
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.src = '';
		}

		// Call the onAudioRemove callback if provided
		if (onAudioRemove) {
			onAudioRemove();
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
				onDrop={handleDrop}
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
				className="absolute -right-2 -top-2 z-10 h-8 w-8 rounded-full bg-background shadow-md hover:bg-destructive hover:text-destructive-foreground"
				onClick={handleRemoveAudio}
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
				audioRef={audioRef}
			/>
		</div>
	);
}
