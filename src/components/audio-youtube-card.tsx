import { Youtube } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from './ui/card';

// Simple YouTube URL validator
const isValidYoutubeUrl = (url: string): boolean => {
	const regExp =
		/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:\S+)?$/;
	return regExp.test(url);
};

export function AudioYoutubeCard() {
	const [youtubeUrl, setYoutubeUrl] = useState('');
	const [isUrlValid, setIsUrlValid] = useState(false);
	const [isValidating, setIsValidating] = useState(false);
	const [validationMessage, setValidationMessage] = useState('');

	// Extract video ID from YouTube URL
	const extractVideoId = (url: string): string | null => {
		const regExp =
			/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:\S+)?$/;
		const match = url.match(regExp);
		return match ? match[1] : null;
	};

	// Check if YouTube video exists
	const checkVideoExists = async (videoId: string): Promise<boolean> => {
		try {
			// Using YouTube's oEmbed API to check if video exists
			const response = await fetch(
				`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
			);
			return response.ok;
		} catch (error) {
			console.error('Error checking YouTube video:', error);
			return false;
		}
	};

	const validateYoutubeUrl = async (url: string) => {
		// First check if URL format is valid
		if (!isValidYoutubeUrl(url)) {
			setIsUrlValid(false);
			setValidationMessage('Please enter a valid YouTube URL');
			return;
		}

		// Then extract video ID and check if video exists
		const videoId = extractVideoId(url);
		if (!videoId) {
			setIsUrlValid(false);
			setValidationMessage('Could not extract video ID from URL');
			return;
		}

		// Check if video exists
		const exists = await checkVideoExists(videoId);
		if (!exists) {
			setIsUrlValid(false);
			setValidationMessage(
				'This YouTube video is unavailable or private'
			);
			return;
		}

		// All checks passed
		setIsUrlValid(true);
		setValidationMessage('Valid YouTube URL! Ready to separate audio.');
	};

	const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newUrl = event.target.value;
		setYoutubeUrl(newUrl);

		// Auto-validate the URL as user types
		if (newUrl) {
			setIsValidating(true);
			setValidationMessage('');

			// Short debounce for validation
			const timer = setTimeout(async () => {
				await validateYoutubeUrl(newUrl);
				setIsValidating(false);
			}, 500);

			return () => clearTimeout(timer);
		} else {
			setIsUrlValid(false);
			setIsValidating(false);
			setValidationMessage('');
		}
	};

	const handleSeparate = () => {
		// This would connect to your separation functionality
		console.log('Separating YouTube audio:', youtubeUrl);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Youtube className="h-5 w-5 text-red-500" />
					YouTube Audio
				</CardTitle>
				<CardDescription>
					Paste a YouTube URL to separate vocals from instruments
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-2">
					<div className="relative">
						<Input
							type="url"
							placeholder="https://www.youtube.com/watch?v=..."
							value={youtubeUrl}
							onChange={handleUrlChange}
							className={cn(
								isValidating &&
									'border-amber-500 ring-amber-500/20',
								!isValidating &&
									isUrlValid &&
									'border-green-500 ring-green-500/20',
								!isValidating &&
									youtubeUrl &&
									!isUrlValid &&
									'border-red-500 ring-red-500/20'
							)}
						/>
						{isValidating && (
							<div className="absolute right-3 top-0 h-full flex items-center">
								<span className="text-xs text-amber-500">
									Validating...
								</span>
							</div>
						)}
					</div>

					{youtubeUrl &&
						!isUrlValid &&
						!isValidating &&
						validationMessage && (
							<p className="text-sm text-red-500">
								{validationMessage}
							</p>
						)}

					{isUrlValid && !isValidating && (
						<p className="text-sm text-green-500">
							{validationMessage}
						</p>
					)}
				</div>

				{isUrlValid && !isValidating && (
					<div className="rounded-lg border border-border bg-card/50 p-4">
						<div className="flex items-center gap-3">
							<div className="h-16 w-20 flex-shrink-0 rounded bg-muted overflow-hidden">
								{extractVideoId(youtubeUrl) && (
									<img
										src={`https://img.youtube.com/vi/${extractVideoId(
											youtubeUrl
										)}/default.jpg`}
										alt="Video thumbnail"
										className="h-full w-full object-cover"
										onError={(e) => {
											// Fallback if thumbnail can't be loaded
											e.currentTarget.style.display =
												'none';
											const parent =
												e.currentTarget.parentElement;
											if (parent) {
												parent.innerHTML =
													'<div class="flex h-full w-full items-center justify-center text-muted-foreground"><svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="6" width="14" height="12" rx="2" ry="2"/></svg></div>';
											}
										}}
									/>
								)}
							</div>
							<div className="flex-1 min-w-0">
								<p className="truncate font-medium">
									{youtubeUrl}
								</p>
								<p className="text-sm text-muted-foreground">
									YouTube Video
								</p>
							</div>
						</div>
					</div>
				)}

				<div className="flex justify-end">
					<Button
						variant="default"
						disabled={!isUrlValid || isValidating}
						onClick={handleSeparate}
						className="space-x-2"
					>
						<span>Separate Audio</span>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
