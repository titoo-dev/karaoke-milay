import { Music } from 'lucide-react';
import { TrackPlayer } from './track-player';

export function AudioPreview() {
	return (
		<div className="flex flex-col space-y-2">
			<label className="text-sm font-medium">Preview</label>
			<TrackPlayer
				icon={Music}
				iconColor="text-primary"
				showDownload={false}
			/>
		</div>
	);
}
