import { useLyricStudioStore } from '@/stores/lyric-studio/store';

export const LyricStudioHeader = () => {
	const trackLoaded = useLyricStudioStore((state) => state.trackLoaded);

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
};
