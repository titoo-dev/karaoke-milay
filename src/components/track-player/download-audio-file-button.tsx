import { memo } from 'react';
import { Button } from '../ui/button';
import { downloadAudioFile } from '@/data/api';
import { Download } from 'lucide-react';

export const DownloadAudioFileButton = memo(
	({ src, showDownload }: { src: string; showDownload: boolean }) => {
		if (!showDownload) return null;

		return (
			<Button
				variant="ghost"
				size="icon"
				className="h-8 w-8 rounded-full"
				onClick={() => downloadAudioFile(src)}
				title="Download track"
			>
				<Download className="h-4 w-4" />
			</Button>
		);
	}
);

DownloadAudioFileButton.displayName = 'DownloadAudioFileButton';
