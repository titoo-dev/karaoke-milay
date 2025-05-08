import { Mic, Music, RotateCcw } from 'lucide-react';
import { TrackPlayer } from './track-player';
import { Button } from './ui/button';
import { getOutputPath } from '@/data/api';

export function OutputTracks({
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
