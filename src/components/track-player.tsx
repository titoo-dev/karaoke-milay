import { downloadAudioFile } from '@/data/api';
import { Button } from './ui/button';
import { Download } from 'lucide-react';

export function TrackPlayer({
	title,
	icon: Icon,
	iconColor,
	src,
}: {
	title: string;
	icon: React.ComponentType<any>;
	iconColor: string;
	src: string;
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
					downloadAudioFile(src);
				}}
			>
				<Download className="mr-2 h-4 w-4" />
				Download {title}
			</Button>
		</div>
	);
}
