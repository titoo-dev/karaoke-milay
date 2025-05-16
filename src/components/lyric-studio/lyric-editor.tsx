import { useAudioRef } from '@/hooks/use-audio-ref';
import { Card, CardContent } from '../ui/card';
import { EmptyLyrics } from './empty-lyrics';
import { LyricEditorHeader } from './lyric-editor-header';
import { LyricList } from './lyric-list';
import { useLyricStudioStore } from '@/stores/lyric-studio/store';
import { useShallow } from 'zustand/react/shallow';

export function LyricEditor() {
	return (
		<Card className="pt-0 shadow-none">
			<LyricEditorHeader />

			<LyricEditorContent />
		</Card>
	);
}

const LyricEditorContent = () => {
	const audioRef = useAudioRef();
	const { lyricLines, addLyricLine } = useLyricStudioStore(
		useShallow((state) => ({
			lyricLines: state.lyricLines,
			addLyricLine: state.addLyricLine,
		}))
	);

	return (
		<CardContent className="p-6">
			{lyricLines.length === 0 ? (
				<EmptyLyrics onAddLine={() => addLyricLine(audioRef.current)} />
			) : (
				<LyricList />
			)}
		</CardContent>
	);
};
