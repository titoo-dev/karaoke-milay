import { AudioWaveform } from 'lucide-react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from './ui/card';
import { EmptyOutputState } from './empty-output-state';
import { ProcessingIndicator } from './progress-indicator';
import { OutputTracks } from './output-tracks';

export function OutputTracksCard({
	file,
	uploadedFileName,
	separateMutation,
	resetState,
}: {
	file: File | null;
	uploadedFileName: string | null;
	separateMutation: any;
	resetState: () => void;
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<AudioWaveform className="h-5 w-5 text-primary" />
					Output Tracks
				</CardTitle>
				<CardDescription>
					Download the separated vocal and instrumental tracks
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				{!file && !separateMutation.isSuccess ? (
					<EmptyOutputState />
				) : (
					<>
						{separateMutation.isPending && <ProcessingIndicator />}

						{separateMutation.isSuccess && uploadedFileName && (
							<OutputTracks
								uploadedFileName={uploadedFileName}
								resetState={resetState}
							/>
						)}
					</>
				)}
			</CardContent>
		</Card>
	);
}
