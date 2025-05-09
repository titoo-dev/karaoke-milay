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

export const Route = createFileRoute('/')({
	component: App,
});

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
