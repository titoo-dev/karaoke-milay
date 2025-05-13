import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import {
	// Import the API functions
	uploadAudioFile,
	separateAudio,
	notifications,
} from '@/data/api';
import { AudioUploadCard } from '@/components/audio-upload-card';
import { OutputTracksCard } from '@/components/output-tracks-card';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { AudioYoutubeCard } from '@/components/audio-youtube-card';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/')({
	component: App,
});

function App() {
	const [file, setFile] = useState<File | null>(null);
	const [audioUrl, setAudioUrl] = useState<string | null>(null);
	const [uploadedFileName, setUploadedFileName] = useState<string | null>(
		null
	);
	const [activeTab, setActiveTab] = useState<'upload' | 'youtube'>('upload');

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
				<div className="mb-8">
					<div className="inline-flex items-center justify-center rounded-lg border border-border bg-card p-1.5 shadow-sm">
						<button
							onClick={() => setActiveTab('upload')}
							className={cn(
								'inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
								activeTab === 'upload'
									? 'bg-primary text-primary-foreground shadow-sm'
									: 'text-muted-foreground hover:bg-muted'
							)}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className={cn(
									'mr-2.5 h-4 w-4',
									activeTab === 'upload'
										? 'text-primary-foreground'
										: 'text-primary'
								)}
							>
								<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
								<polyline points="17 8 12 3 7 8" />
								<line x1="12" y1="3" x2="12" y2="15" />
							</svg>
							File Upload
						</button>
						<button
							onClick={() => setActiveTab('youtube')}
							className={cn(
								'inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ml-2',
								activeTab === 'youtube'
									? 'bg-primary text-primary-foreground shadow-sm'
									: 'text-muted-foreground hover:bg-muted'
							)}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className={cn(
									'mr-2.5 h-4 w-4',
									activeTab === 'youtube'
										? 'text-primary-foreground'
										: 'text-primary'
								)}
							>
								<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
								<path d="m10 15 5-3-5-3z" />
							</svg>
							YouTube
						</button>
					</div>
				</div>

				<div className="grid gap-8 md:grid-cols-2">
					{activeTab === 'upload' ? (
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
					) : (
						<AudioYoutubeCard />
					)}

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
