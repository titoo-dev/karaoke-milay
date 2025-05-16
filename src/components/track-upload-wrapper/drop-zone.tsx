import { cn } from '@/lib/utils';
import { useLyricStudioStore } from '@/stores/lyric-studio/store';
import { useTrackUploadStore } from '@/stores/track-upload-wrapper/store';
import { Upload } from 'lucide-react';
import { useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Button } from '../ui/button';

export const DropZone = () => {
	const {
		isDragging,
		handleDrop,
		handleDragOver,
		handleDragLeave,
		handleDragEnter,
		handleFileChange,
	} = useTrackUploadStore(
		useShallow((state) => ({
			isDragging: state.isDragging,
			handleDrop: state.handleDrop,
			handleDragOver: state.handleDragOver,
			handleDragLeave: state.handleDragLeave,
			handleDragEnter: state.handleDragEnter,
			handleFileChange: state.handleFileChange,
		}))
	);
	const { setTrackLoaded } = useLyricStudioStore();

	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			handleFileChange(file);
		}
	};

	const handleBrowseClick = () => {
		fileInputRef.current?.click();
	};

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
};
