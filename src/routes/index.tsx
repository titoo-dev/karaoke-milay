import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import {
	// Import the API functions
	uploadAudioFile,
	separateAudio,
	separateYoutubeAudio,
	notifications,
	type SeparationResponse,
} from '@/data/api';
import { AudioUploadCard } from '@/components/audio-upload-card';
import { OutputTracksCard } from '@/components/output-tracks-card';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { AudioYoutubeCard } from '@/components/audio-youtube-card';
import { cn } from '@/lib/utils';

// Add interface for video metadata
interface VideoMetadata {
	title: string;
	author_name: string;
	duration?: number;
	width: number;
	height: number;
	thumbnail_url: string;
}

// YouTube URL validator
const isValidYoutubeUrl = (url: string): boolean => {
	const regExp =
		/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:\S+)?$/;
	return regExp.test(url);
};

// Extract video ID from YouTube URL
const extractVideoId = (url: string): string | null => {
	const regExp =
		/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:\S+)?$/;
	const match = url.match(regExp);
	return match ? match[1] : null;
};

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
	const [separationResponse, setSeparationResponse] =
		useState<SeparationResponse | null>(null);
	const [youtubeUrl, setYoutubeUrl] = useState('');
	const [isUrlValid, setIsUrlValid] = useState(false);
	const [isValidating, setIsValidating] = useState(false);
	const [validationMessage, setValidationMessage] = useState('');
	const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(
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
		onSuccess: (data) => {
			setSeparationResponse(data);
			notifications.separationSuccess();
		},
		onError: (error) => {
			console.error('Separation error:', error);
			notifications.separationError(error as Error);
		},
		retry: false,
	});

	// YouTube separation mutation
	const separateYoutubeMutation = useMutation({
		mutationFn: separateYoutubeAudio,
		onSuccess: (data) => {
			setSeparationResponse(data);
			notifications.youtubeSeparationSuccess();
		},
		onError: (error) => {
			console.error('YouTube separation error:', error);
			notifications.youtubeSeparationError(error as Error);
		},
		retry: false,
	});

	// Check if YouTube video exists and fetch metadata
	const checkVideoExists = async (videoId: string): Promise<boolean> => {
		try {
			const response = await fetch(
				`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
			);

			if (response.ok) {
				const data = await response.json();
				setVideoMetadata(data);
				return true;
			}
			setVideoMetadata(null);
			return false;
		} catch (error) {
			console.error('Error checking YouTube video:', error);
			setVideoMetadata(null);
			return false;
		}
	};

	const validateYoutubeUrl = async (url: string) => {
		if (!isValidYoutubeUrl(url)) {
			setIsUrlValid(false);
			setValidationMessage('Please enter a valid YouTube URL');
			setVideoMetadata(null);
			return;
		}

		const videoId = extractVideoId(url);
		if (!videoId) {
			setIsUrlValid(false);
			setValidationMessage('Could not extract video ID from URL');
			setVideoMetadata(null);
			return;
		}

		const exists = await checkVideoExists(videoId);
		if (!exists) {
			setIsUrlValid(false);
			setValidationMessage(
				'This YouTube video is unavailable or private'
			);
			return;
		}

		setIsUrlValid(true);
		setValidationMessage('Valid YouTube URL! Ready to separate audio.');
	};

	const handleYoutubeUrlChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const newUrl = event.target.value;
		setYoutubeUrl(newUrl);

		if (newUrl) {
			setIsValidating(true);
			setValidationMessage('');
			setVideoMetadata(null);

			const timer = setTimeout(async () => {
				await validateYoutubeUrl(newUrl);
				setIsValidating(false);
			}, 500);

			return () => clearTimeout(timer);
		} else {
			setIsUrlValid(false);
			setIsValidating(false);
			setValidationMessage('');
			setVideoMetadata(null);
		}
	};

	// Handle YouTube separation
	const handleSeparateYoutube = (url: string) => {
		notifications.youtubeSeparationStart();
		separateYoutubeMutation.mutate(url);
	};

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
		separateYoutubeMutation.reset();
		uploadMutation.reset();
		setFile(null);
		setAudioUrl(null);
		setUploadedFileName(null);
		setSeparationResponse(null);
	};

	// Handle tab change with separation pending check
	const handleTabChange = (tab: 'upload' | 'youtube') => {
		if (!separateMutation.isPending && !separateYoutubeMutation.isPending) {
			setActiveTab(tab);
		}
	};

	return (
		<div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-background/90">
			<Header />

			<main className="container mx-auto flex-1 py-10">
				<div className="mb-8">
					<div className="inline-flex items-center justify-center rounded-lg border border-border bg-card p-1.5 shadow-sm">
						<button
							onClick={() => handleTabChange('upload')}
							className={cn(
								'inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
								activeTab === 'upload'
									? 'bg-primary text-primary-foreground shadow-sm'
									: 'text-muted-foreground hover:bg-muted',
								separateMutation.isPending ||
									(separateYoutubeMutation.isPending &&
										'opacity-50 cursor-not-allowed')
							)}
							disabled={
								separateMutation.isPending ||
								separateYoutubeMutation.isPending
							}
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
							onClick={() => handleTabChange('youtube')}
							className={cn(
								'inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ml-2',
								activeTab === 'youtube'
									? 'bg-primary text-primary-foreground shadow-sm'
									: 'text-muted-foreground hover:bg-muted',
								separateMutation.isPending ||
									(separateYoutubeMutation.isPending &&
										'opacity-50 cursor-not-allowed')
							)}
							disabled={
								separateMutation.isPending ||
								separateYoutubeMutation.isPending
							}
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
						<AudioYoutubeCard
							separationResponse={separationResponse}
							separateYoutubeMutation={separateYoutubeMutation}
							handleSeparateYoutube={handleSeparateYoutube}
							youtubeUrl={youtubeUrl}
							isUrlValid={isUrlValid}
							isValidating={isValidating}
							validationMessage={validationMessage}
							videoMetadata={videoMetadata}
							handleUrlChange={handleYoutubeUrlChange}
						/>
					)}

					<OutputTracksCard
						separationResponse={separationResponse}
						separateMutation={separateMutation}
						separateYoutubeMutation={separateYoutubeMutation}
						resetState={resetState}
					/>
				</div>
			</main>

			<Footer />
			<Toaster />
		</div>
	);
}
