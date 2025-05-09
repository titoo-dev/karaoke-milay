import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

interface ProcessingStatus {
	status: 'started' | 'processing' | 'completed' | 'failed' | 'error';
	message: string;
	progress: number;
	files?: {
		vocals: string;
		instrumental: string;
	};
}

export function ProcessingIndicator() {
	const [status, setStatus] = useState<ProcessingStatus>({
		status: 'started',
		message: 'Starting audio separation',
		progress: 0,
	});

	useEffect(() => {
		const eventSource = new EventSource('http://localhost:8000/stream');

		eventSource.addEventListener('separation-progress', (event) => {
			const data = JSON.parse(event.data);
			setStatus(data);
		});

		return () => {
			eventSource.close();
		};
	}, []);

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle className="flex items-center">
					{status.status !== 'completed' && (
						<Loader2 className="h-5 w-5 mr-2 animate-spin text-primary" />
					)}
					Audio Separation
					<Badge
						variant={
							status.status === 'error' ||
							status.status === 'failed'
								? 'destructive'
								: status.status === 'completed'
								? 'outline'
								: 'secondary'
						}
						className={`ml-2 ${
							status.status === 'completed'
								? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900'
								: ''
						}`}
					>
						{status.status}
					</Badge>
				</CardTitle>
				<CardDescription>{status.message}</CardDescription>
			</CardHeader>
			<CardContent>
				<Progress value={status.progress} className="h-2 mb-4" />
				<div className="text-sm text-muted-foreground">
					{status.status === 'processing' && (
						<p>Processing: {status.progress}% complete</p>
					)}
					{status.status === 'started' && (
						<p>Preparing audio files for separation...</p>
					)}
					{(status.status === 'error' ||
						status.status === 'failed') && (
						<p className="text-destructive">
							An error occurred during processing.
						</p>
					)}
					{status.status === 'completed' && status.files && (
						<div className="mt-4 space-y-2">
							<p className="font-medium text-green-600 dark:text-green-400">
								Separation completed successfully!
							</p>
							<p>Your separated audio files are ready:</p>
							<div className="grid grid-cols-2 gap-2 mt-2">
								<a
									href={status.files.vocals}
									className="px-3 py-2 text-center rounded-md bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
									download
								>
									Download Vocals
								</a>
								<a
									href={status.files.instrumental}
									className="px-3 py-2 text-center rounded-md bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
									download
								>
									Download Instrumental
								</a>
							</div>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
