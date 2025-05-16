import { memo } from 'react';

interface LyricStudioHeaderProps {
	trackLoaded: boolean;
}

export const LyricStudioHeader = memo(
	({ trackLoaded }: LyricStudioHeaderProps) => {
		return (
			<div className="mb-6 space-y-2">
				<h1 className="text-3xl font-bold tracking-tight leading-relaxed">
					Lyrics Studio
				</h1>
				<p className="text-muted-foreground leading-relaxed">
					{trackLoaded
						? 'Create and edit lyrics for your track'
						: 'Upload an audio track to get started'}
				</p>
			</div>
		);
	}
);
