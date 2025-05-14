import { createFileRoute } from '@tanstack/react-router';
import { TrackPlayer } from '@/components/track-player';
import { Music, PlusCircle, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { getOutputPath } from '@/data/api';

export const Route = createFileRoute('/lyric-studio')({
	component: LyricStudioPage,
});

function LyricStudioPage() {
	const [lyricLines, setLyricLines] = useState([
		{
			id: 1,
			text: 'Tonga aho anoroka ny takolakao',
			timestamp: 0,
		},
	]);
	const audioRef = useRef<HTMLAudioElement>(null!);

	// Format seconds to mm:ss.ms
	const formatTimestamp = (seconds: number): string => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
			.toFixed(2)
			.padStart(5, '0')}`;
	};

	// Parse mm:ss.ms to seconds - keeping for potential future manual timestamp entry
	// const parseTimestamp = (timestamp: string): number => {
	// 	const [minutePart, secondPart] = timestamp.split(':');
	// 	const minutes = parseInt(minutePart, 10);
	// 	const seconds = parseFloat(secondPart);
	// 	return minutes * 60 + seconds;
	// };

	// Check if setting a timestamp at index would violate ascending sequence
	const isValidTimestampPosition = (
		index: number,
		timestamp: number
	): boolean => {
		const prevLine = index > 0 ? lyricLines[index - 1] : null;
		const nextLine =
			index < lyricLines.length - 1 ? lyricLines[index + 1] : null;

		if (prevLine && timestamp < prevLine.timestamp) return false;
		if (nextLine && timestamp > nextLine.timestamp) return false;

		return true;
	};

	// Find index of line by id
	const getLineIndexById = (id: number): number => {
		return lyricLines.findIndex((line) => line.id === id);
	};

	// Jump to timestamp of specific lyric line
	const jumpToLyricLine = (id: number) => {
		const line = lyricLines.find((line) => line.id === id);
		if (line && audioRef.current) {
			audioRef.current.currentTime = line.timestamp;
			audioRef.current
				.play()
				.catch((err) => console.error('Playback failed:', err));
		}
	};

	const addLyricLine = (afterId?: number) => {
		const newId = Math.max(0, ...lyricLines.map((line) => line.id)) + 1;
		const currentTimestamp = audioRef.current?.currentTime || 0;

		if (afterId) {
			const index = lyricLines.findIndex((line) => line.id === afterId);
			const newLines = [...lyricLines];

			// Ensure the new timestamp follows ascending sequence
			let newTimestamp = currentTimestamp;
			const prevTimestamp = newLines[index].timestamp;
			const nextTimestamp =
				index < newLines.length - 1
					? newLines[index + 1].timestamp
					: Infinity;

			// Make sure timestamp is between prev and next
			if (newTimestamp <= prevTimestamp) {
				newTimestamp = prevTimestamp + 0.5; // Add a small increment
			}
			if (nextTimestamp !== Infinity && newTimestamp >= nextTimestamp) {
				newTimestamp = (prevTimestamp + nextTimestamp) / 2; // Use middle point
			}

			newLines.splice(index + 1, 0, {
				id: newId,
				text: '',
				timestamp: newTimestamp,
			});
			setLyricLines(newLines);
		} else {
			// For adding at the end, make sure it's greater than the last timestamp
			let newTimestamp = currentTimestamp;
			if (lyricLines.length > 0) {
				const lastTimestamp =
					lyricLines[lyricLines.length - 1].timestamp;
				if (newTimestamp <= lastTimestamp) {
					newTimestamp = lastTimestamp + 0.5; // Add a small increment
				}
			}

			setLyricLines([
				...lyricLines,
				{ id: newId, text: '', timestamp: newTimestamp },
			]);
		}
	};

	const updateLyricLine = (
		id: number,
		data: Partial<(typeof lyricLines)[0]>
	) => {
		// If updating timestamp, validate it follows ascending sequence
		if ('timestamp' in data) {
			const index = getLineIndexById(id);
			if (!isValidTimestampPosition(index, data.timestamp as number)) {
				return; // Don't update if it violates the sequence
			}
		}

		setLyricLines(
			lyricLines.map((line) =>
				line.id === id ? { ...line, ...data } : line
			)
		);
	};

	const deleteLyricLine = (id: number) => {
		setLyricLines(lyricLines.filter((line) => line.id !== id));
	};

	const setCurrentTimeAsTimestamp = (id: number) => {
		if (audioRef.current) {
			const index = getLineIndexById(id);
			const newTimestamp = audioRef.current.currentTime;

			// Only update if it maintains ascending sequence
			if (isValidTimestampPosition(index, newTimestamp)) {
				updateLyricLine(id, { timestamp: newTimestamp });
			}
		}
	};

	// Check if current audio time can be used as timestamp for a specific line
	const canUseCurrentTime = (index: number): boolean => {
		if (!audioRef.current) return false;
		return isValidTimestampPosition(index, audioRef.current.currentTime);
	};

	// Check if all lyric lines have text
	const hasEmptyLyricLines = (): boolean => {
		return lyricLines.some((line) => line.text.trim() === '');
	};

	// Format time for LRC format
	const formatLRCTimestamp = (seconds: number): string => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
			.toFixed(2)
			.padStart(5, '0')}`;
	};

	// Generate LRC format and log it
	const generateLRC = () => {
		// Sort lyrics by timestamp to ensure proper order
		const sortedLyrics = [...lyricLines].sort(
			(a, b) => a.timestamp - b.timestamp
		);

		const lrcData = {
			metadata: {
				title: 'Untitled Song',
				artist: 'Unknown Artist',
				album: 'Unknown Album',
				timestamps: sortedLyrics.map((line) => ({
					time: formatLRCTimestamp(line.timestamp),
					text: line.text,
				})),
			},
		};

		console.log('LRC Data (JSON format):', lrcData);
		return lrcData;
	};

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
				<div className="rounded-xl border bg-card overflow-hidden">
					<div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4 flex items-center justify-between">
						<h2 className="text-xl font-semibold flex items-center gap-2">
							<Music className="h-5 w-5 text-primary" />
							Lyric Editor
						</h2>
						<button
							onClick={generateLRC}
							disabled={
								hasEmptyLyricLines() || lyricLines.length === 0
							}
							className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-9 px-4 py-2 ${
								hasEmptyLyricLines() || lyricLines.length === 0
									? 'bg-muted text-muted-foreground cursor-not-allowed'
									: 'bg-primary text-primary-foreground hover:bg-primary/90'
							}`}
							title={
								hasEmptyLyricLines()
									? 'Fill in all lyric lines before downloading'
									: 'Download lyrics in LRC format'
							}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="mr-2"
							>
								<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
								<polyline points="7 10 12 15 17 10" />
								<line x1="12" y1="15" x2="12" y2="3" />
							</svg>
							Download
						</button>
					</div>

					{lyricLines.length === 0 ? (
						<div className="flex flex-col items-center justify-center p-12 text-center m-6 rounded-lg border border-dashed bg-muted/30 backdrop-blur-sm">
							<div className="rounded-full bg-primary/10 p-4 mb-4">
								<Music className="h-10 w-10 text-primary" />
							</div>
							<h3 className="text-lg font-medium mb-2">
								No lyrics yet
							</h3>
							<p className="text-muted-foreground mb-6 max-w-md">
								Add your first lyric line to start creating your
								masterpiece
							</p>
							<button
								onClick={() => addLyricLine()}
								className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2"
							>
								<PlusCircle className="mr-2 h-4 w-4" /> Add
								First Line
							</button>
						</div>
					) : (
						<div className="p-6">
							<div className="space-y-3">
								{lyricLines.map((line, index) => {
									const canSetCurrentTime =
										canUseCurrentTime(index);
									return (
										<div
											key={line.id}
											className="group relative rounded-lg border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all focus-within:ring-1 focus-within:ring-primary/30 overflow-hidden"
										>
											<div className="flex items-center gap-3 p-3">
												<div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-sm shrink-0">
													{index + 1}
												</div>

												<div className="flex-1">
													<input
														id={`text-${line.id}`}
														value={line.text}
														onChange={(e) =>
															updateLyricLine(
																line.id,
																{
																	text: e
																		.target
																		.value,
																}
															)
														}
														className="w-full bg-transparent border-none text-base focus:outline-none focus:ring-0 placeholder:text-muted-foreground/60"
														placeholder="Enter lyrics..."
													/>
												</div>

												<div className="flex items-center gap-3 shrink-0">
													{/* Timestamp Display */}
													<div className="flex items-center gap-2 rounded-lg border bg-background/50 backdrop-blur-sm p-2">
														<button
															onClick={() =>
																jumpToLyricLine(
																	line.id
																)
															}
															className="flex items-center gap-2 hover:bg-primary/10 hover:cursor-pointer rounded-sm px-2 py-2 transition-colors"
															title="Jump to this timestamp"
														>
															<span className="w-20 text-center text-sm font-mono">
																{formatTimestamp(
																	line.timestamp
																)}
															</span>
														</button>

														<button
															onClick={() =>
																setCurrentTimeAsTimestamp(
																	line.id
																)
															}
															className={`p-1.5 rounded-md ${
																canSetCurrentTime
																	? 'hover:bg-primary/10 text-primary'
																	: 'text-muted-foreground cursor-not-allowed opacity-50'
															}`}
															title={
																canSetCurrentTime
																	? 'Set current time as timestamp'
																	: 'Current time would break the ascending sequence'
															}
															disabled={
																!canSetCurrentTime
															}
														>
															<svg
																width="14"
																height="14"
																viewBox="0 0 24 24"
																fill="none"
																xmlns="http://www.w3.org/2000/svg"
															>
																<path
																	d="M9 4H5C4.44772 4 4 4.44772 4 5V9"
																	stroke="currentColor"
																	strokeWidth="2"
																	strokeLinecap="round"
																	strokeLinejoin="round"
																/>
																<path
																	d="M15 4H19C19.5523 4 20 4.44772 20 5V9"
																	stroke="currentColor"
																	strokeWidth="2"
																	strokeLinecap="round"
																	strokeLinejoin="round"
																/>
																<path
																	d="M9 20H5C4.44772 20 4 19.5523 4 19V15"
																	stroke="currentColor"
																	strokeWidth="2"
																	strokeLinecap="round"
																	strokeLinejoin="round"
																/>
																<path
																	d="M15 20H19C19.5523 20 20 19.5523 20 19V15"
																	stroke="currentColor"
																	strokeWidth="2"
																	strokeLinecap="round"
																	strokeLinejoin="round"
																/>
																<circle
																	cx="12"
																	cy="12"
																	r="3"
																	stroke="currentColor"
																	strokeWidth="2"
																/>
															</svg>
														</button>
													</div>

													{/* Action Buttons */}
													<div className="flex gap-1">
														<button
															onClick={() =>
																deleteLyricLine(
																	line.id
																)
															}
															className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-destructive"
															title="Delete line"
														>
															<Trash2 className="h-4 w-4" />
														</button>
													</div>
												</div>
											</div>
										</div>
									);
								})}

								<div className="flex justify-center mt-6">
									<button
										onClick={() => addLyricLine()}
										disabled={hasEmptyLyricLines()}
										className={`inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border h-10 px-6 gap-2 ${
											hasEmptyLyricLines()
												? 'border-muted bg-muted/50 text-muted-foreground cursor-not-allowed'
												: 'border-primary/20 bg-primary/5 text-primary hover:bg-primary/10'
										}`}
										title={
											hasEmptyLyricLines()
												? 'Fill in all lyric lines before adding a new one'
												: 'Add a new lyric line'
										}
									>
										<PlusCircle className="h-4 w-4" /> Add
										New Line
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
			{/* Spacer for fixed player */}
			<div className="h-58"></div>

			{/* Floating track player with integrated timestamp */}
			<div className="fixed bottom-6 left-1/2 z-50 w-full max-w-xl -translate-x-1/2 transform">
				<TrackPlayer
					title="Current Track"
					icon={Music}
					iconColor="text-blue-500"
					src={getOutputPath(
						'output/htdemucs/audio-1747214945-146323308/no_vocals.mp3'
					)}
					showDownload={false}
					audioRef={audioRef}
				/>
			</div>
		</main>
	);
}
