import { createFileRoute } from '@tanstack/react-router';
import { TrackPlayer } from '@/components/track-player';
import { Music } from 'lucide-react';

export const Route = createFileRoute('/lyric-studio')({
	component: LyricStudioPage,
});

function LyricStudioPage() {
	return (
		<main className="container relative min-h-screen py-6">
			<div className="mb-6">
				<h1 className="text-3xl font-bold tracking-tight">
					Lyric Studio
				</h1>
				<p className="text-muted-foreground">
					Create and edit lyrics for your tracks
				</p>
			</div>

			{/* Main content area */}
			<div className="grid gap-6">
				<div className="rounded-lg border p-4">
					<p>Your lyric editing workspace will go here</p>
				</div>
			</div>

			{/* Floating track player */}
			<div className="fixed bottom-6 left-1/2 z-50 w-full max-w-xl -translate-x-1/2 transform">
				<TrackPlayer
					title="Current Track"
					icon={Music}
					iconColor="text-blue-500"
					src="/demo-track.mp3"
					showDownload={false}
				/>
			</div>
		</main>
	);
}
