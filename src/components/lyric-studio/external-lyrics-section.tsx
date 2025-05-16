import { ArrowRightCircle, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { useLyricStudioStore } from '@/stores/lyric-studio/store';
import { useAudioRef } from '@/hooks/use-audio-ref';

export function ExternalLyricsSection() {
	const {
		showExternalLyrics,
		externalLyrics,
		setExternalLyrics,
		addLinesFromExternal,
	} = useLyricStudioStore();
	const audioRef = useAudioRef();

	if (!showExternalLyrics) return null;

	return (
		<Card className="pt-0 shadow-none overflow-hidden">
			<CardHeader className="flex flex-row items-center justify-between border-b pt-6">
				<CardTitle className="flex items-center gap-2 py-3">
					<FileText className="h-5 w-5 text-primary" />
					External Lyrics
				</CardTitle>
				<Button
					onClick={() => addLinesFromExternal(audioRef.current)}
					variant="outline"
					size="sm"
					className="gap-2"
					disabled={!externalLyrics.trim()}
					title="Create lyric lines from this text"
				>
					<ArrowRightCircle className="h-4 w-4" />
					Convert to Lines
				</Button>
			</CardHeader>
			<CardContent className="px-4">
				<Textarea
					placeholder="Paste lyrics here, one line per lyric..."
					className="min-h-[200px] w-full resize-none border-muted text-foreground/90 focus:border-primary transition-colors scrollbar-hide overflow-hidden"
					value={externalLyrics}
					onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
						setExternalLyrics(e.target.value);
						// Auto-resize the textarea
						e.target.style.height = 'auto';
						e.target.style.height = `${e.target.scrollHeight}px`;
					}}
					onFocus={(e) => {
						// Ensure correct height on focus
						e.target.style.height = 'auto';
						e.target.style.height = `${e.target.scrollHeight}px`;
					}}
					spellCheck={false}
				/>
				<div className="mt-2 text-sm text-muted-foreground">
					Paste or type song lyrics. Each line will be converted to a
					separate lyric line.
				</div>
			</CardContent>
		</Card>
	);
}
