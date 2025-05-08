import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from '@/components/ui/card';
import {
	// Import the API functions
	uploadAudioFile,
	separateAudio,
	getOutputPath,
	notifications,
	downloadAudioFile,
} from '@/data/api';

import {
	Upload,
	AudioWaveform,
	Music,
	Music2,
	Mic,
	Download,
	Loader2,
	RotateCcw,
} from 'lucide-react';

export const Route = createFileRoute('/')({
	component: App,
});

// Header Component
function Header() {
	return (
		<header className="px-4 sticky top-0 z-50 w-full border-b bg-background/60 backdrop-blur">
			<div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
				<div className="flex items-center gap-2">
					<AudioWaveform className="h-6 w-6 text-primary" />
					<h1 className="text-xl font-bold text-foreground">
						Karaoke Milay
					</h1>
				</div>
			</div>
		</header>
	);
}

// DropZone Component
function DropZone({
	file,
	handleFileChange,
}: {
	file: File | null;
	handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
	return (
		<div
			className={cn(
				'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 transition-colors',
				'bg-muted/40 hover:bg-muted/60',
				file ? 'border-primary/50' : 'border-border'
			)}
			onClick={() => document.getElementById('audio-file')?.click()}
		>
			<input
				type="file"
				id="audio-file"
				className="hidden"
				accept="audio/*"
				onChange={handleFileChange}
			/>
			<div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
				{!file ? (
					<Upload className="h-10 w-10 text-primary/80" />
				) : (
					<Music className="h-10 w-10 text-primary/80" />
				)}
			</div>
			<p className="mt-4 text-sm font-medium text-foreground">
				{file ? file.name : 'Drag and drop or click to upload'}
			</p>
			<p className="mt-1 text-xs text-muted-foreground">
				Supports MP3, WAV, OGG, FLAC
			</p>
		</div>
	);
}

// FileDetails Component
function FileDetails({ file }: { file: File }) {
	return (
		<div className="rounded-lg bg-card p-4 shadow-sm">
			<h3 className="mb-2 font-semibold">File Details</h3>
			<div className="grid gap-1 text-sm">
				<div className="flex justify-between">
					<span className="text-muted-foreground">Name:</span>
					<span className="font-medium">{file.name}</span>
				</div>
				<div className="flex justify-between">
					<span className="text-muted-foreground">Size:</span>
					<span className="font-medium">
						{(file.size / (1024 * 1024)).toFixed(2)} MB
					</span>
				</div>
				<div className="flex justify-between">
					<span className="text-muted-foreground">Type:</span>
					<span className="font-medium">{file.type}</span>
				</div>
			</div>
		</div>
	);
}

// AudioPreview Component
function AudioPreview({ audioUrl }: { audioUrl: string }) {
	return (
		<div>
			<label className="mb-2 block text-sm font-medium">Preview</label>
			<audio
				src={audioUrl}
				controls
				className="w-full rounded-md border"
			/>
		</div>
	);
}

// ActionButtons Component
function ActionButtons({
	file,
	uploadedFileName,
	uploadMutation,
	separateMutation,
	handleUpload,
	handleSeparate,
}: {
	file: File | null;
	uploadedFileName: string | null;
	uploadMutation: any;
	separateMutation: any;
	handleUpload: () => void;
	handleSeparate: () => void;
}) {
	return (
		<div className="flex flex-col gap-2">
			<Button
				onClick={handleUpload}
				disabled={
					!file ||
					uploadMutation.isPending ||
					uploadMutation.isSuccess ||
					separateMutation.isPending ||
					separateMutation.isSuccess
				}
				className="w-full"
				variant="default"
			>
				{uploadMutation.isPending ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Uploading...
					</>
				) : (
					<>Upload Audio</>
				)}
			</Button>

			<Button
				onClick={handleSeparate}
				disabled={
					!uploadedFileName ||
					separateMutation.isPending ||
					separateMutation.isSuccess
				}
				className="w-full"
				variant="secondary"
			>
				{separateMutation.isPending ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Separating...
					</>
				) : (
					<>Separate Vocals</>
				)}
			</Button>
		</div>
	);
}

// AudioUploadCard Component
function AudioUploadCard({
	file,
	audioUrl,
	uploadedFileName,
	uploadMutation,
	separateMutation,
	handleFileChange,
	handleUpload,
	handleSeparate,
}: {
	file: File | null;
	audioUrl: string | null;
	uploadedFileName: string | null;
	uploadMutation: any;
	separateMutation: any;
	handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	handleUpload: () => void;
	handleSeparate: () => void;
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Upload className="h-5 w-5 text-primary" />
					Upload Audio
				</CardTitle>
				<CardDescription>
					Upload your audio file to separate vocals from instruments
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<DropZone file={file} handleFileChange={handleFileChange} />

				{file && <FileDetails file={file} />}

				{audioUrl && <AudioPreview audioUrl={audioUrl} />}

				<ActionButtons
					file={file}
					uploadedFileName={uploadedFileName}
					uploadMutation={uploadMutation}
					separateMutation={separateMutation}
					handleUpload={handleUpload}
					handleSeparate={handleSeparate}
				/>
			</CardContent>
		</Card>
	);
}

// ProcessingIndicator Component
function ProcessingIndicator() {
	return (
		<div className="flex flex-col items-center justify-center rounded-lg bg-card p-8 text-center">
			<div className="relative">
				<div className="relative z-10">
					<Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
					<h3 className="mt-4 text-lg font-medium">
						Processing Audio
					</h3>
					<p className="mt-2 text-sm text-muted-foreground">
						This may take a few minutes depending on the file
						size...
					</p>
				</div>
			</div>
		</div>
	);
}

// TrackPlayer Component
function TrackPlayer({
	title,
	icon: Icon,
	iconColor,
	src,
	downloadType,
	fileName,
}: {
	title: string;
	icon: React.ComponentType<any>;
	iconColor: string;
	src: string;
	downloadType: 'vocals' | 'no_vocals';
	fileName: string;
}) {
	return (
		<div className="rounded-lg border bg-card p-4 shadow-sm">
			<h3 className="mb-2 flex items-center gap-2 font-semibold">
				<Icon className={`h-4 w-4 ${iconColor}`} />
				{title}
			</h3>
			<audio src={src} controls className="mb-3 w-full" />
			<Button
				variant="outline"
				size="sm"
				className="w-full"
				onClick={() => {
					downloadAudioFile(downloadType, fileName);
				}}
			>
				<Download className="mr-2 h-4 w-4" />
				Download {title}
			</Button>
		</div>
	);
}

// OutputTracks Component
function OutputTracks({
	uploadedFileName,
	resetState,
}: {
	uploadedFileName: string;
	resetState: () => void;
}) {
	return (
		<div className="space-y-4">
			<TrackPlayer
				title="Vocals Track"
				icon={Mic}
				iconColor="text-primary"
				src={getOutputPath(uploadedFileName, 'vocals')}
				downloadType="vocals"
				fileName={uploadedFileName}
			/>

			<TrackPlayer
				title="Instrumental Track"
				icon={Music}
				iconColor="text-secondary"
				src={getOutputPath(uploadedFileName, 'no_vocals')}
				downloadType="no_vocals"
				fileName={uploadedFileName}
			/>

			<Button variant="ghost" className="w-full" onClick={resetState}>
				<RotateCcw className="mr-2 h-4 w-4" />
				Process Another File
			</Button>
		</div>
	);
}

// EmptyOutputState Component
function EmptyOutputState() {
	return (
		<div className="flex h-[300px] flex-col items-center justify-center rounded-lg bg-muted/40 p-10">
			<div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
				<Music2 className="h-10 w-10 text-accent/80" />
			</div>
			<p className="mt-4 text-sm font-medium text-foreground">
				No audio processed yet
			</p>
			<p className="mt-1 text-xs text-center text-muted-foreground">
				Upload an audio file and click "Separate Vocals" to get started
			</p>
		</div>
	);
}

// OutputTracksCard Component
function OutputTracksCard({
	file,
	uploadedFileName,
	separateMutation,
	resetState,
}: {
	file: File | null;
	uploadedFileName: string | null;
	separateMutation: any;
	resetState: () => void;
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<AudioWaveform className="h-5 w-5 text-primary" />
					Output Tracks
				</CardTitle>
				<CardDescription>
					Download the separated vocal and instrumental tracks
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				{!file && !separateMutation.isSuccess ? (
					<EmptyOutputState />
				) : (
					<>
						{separateMutation.isPending && <ProcessingIndicator />}

						{separateMutation.isSuccess && uploadedFileName && (
							<OutputTracks
								uploadedFileName={uploadedFileName}
								resetState={resetState}
							/>
						)}
					</>
				)}
			</CardContent>
		</Card>
	);
}

// Footer Component
function Footer() {
	return (
		<footer className="border-t py-6">
			<div className="container flex mx-auto max-w-sm flex-col items-center justify-around gap-4 md:flex-row">
				<p className="text-center text-sm text-muted-foreground">
					&copy; {new Date().getFullYear()} Karaoke Milay • Developed
					by titoo-dev
				</p>
				<div className="flex items-center gap-4">
					<a
						href="#"
						className="text-sm text-muted-foreground hover:text-foreground"
					>
						Contact
					</a>
				</div>
			</div>
		</footer>
	);
}

// Main App Component
function App() {
	const [file, setFile] = useState<File | null>(null);
	const [audioUrl, setAudioUrl] = useState<string | null>(null);
	const [uploadedFileName, setUploadedFileName] = useState<string | null>(
		null
	);

	// File upload mutation
	const uploadMutation = useMutation({
		mutationFn: uploadAudioFile,
		onSuccess: (data) => {
			setUploadedFileName(data.file.storedFilename);
			notifications.uploadSuccess(data.file.originalFilename);
		},
		onError: (error) => {
			notifications.uploadError(error as Error);
		},
	});

	// Separation mutation
	const separateMutation = useMutation({
		mutationFn: separateAudio,
		onSuccess: () => {
			notifications.separationSuccess();
		},
		onError: (error) => {
			notifications.separationError(error as Error);
		},
	});

	// Handle file selection
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = event.target.files?.[0];
		if (selectedFile) {
			setFile(selectedFile);
			setAudioUrl(URL.createObjectURL(selectedFile));
		}
	};

	// Handle file upload
	const handleUpload = () => {
		if (file) {
			uploadMutation.mutate(file);
		}
	};

	// Handle separation
	const handleSeparate = () => {
		if (uploadedFileName) {
			separateMutation.mutate(uploadedFileName);
		}
	};

	// Reset state
	const resetState = () => {
		separateMutation.reset();
		uploadMutation.reset();
		setFile(null);
		setAudioUrl(null);
		setUploadedFileName(null);
	};

	return (
		<div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-background/90">
			<Header />

			<main className="container mx-auto flex-1 py-10">
				<div className="grid gap-8 md:grid-cols-2">
					<AudioUploadCard
						file={file}
						audioUrl={audioUrl}
						uploadedFileName={uploadedFileName}
						uploadMutation={uploadMutation}
						separateMutation={separateMutation}
						handleFileChange={handleFileChange}
						handleUpload={handleUpload}
						handleSeparate={handleSeparate}
					/>

					<OutputTracksCard
						file={file}
						uploadedFileName={uploadedFileName}
						separateMutation={separateMutation}
						resetState={resetState}
					/>
				</div>
			</main>

			<Footer />
			<Toaster />
		</div>
	);
}
