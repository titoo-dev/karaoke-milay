import { Download, Eye, Music, FileText } from 'lucide-react';
import { CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useLyricStudioStore } from '@/stores/lyric-studio/store';
import { memo } from 'react';
import { useShallow } from 'zustand/react/shallow';

interface LyricMetadata {
	title: string;
	artist: string;
	album: string;
	timestamps: {
		time: string;
		text: string;
	}[];
}

export interface LRCData {
	metadata: LyricMetadata;
}

export function LyricEditorHeader() {
	return (
		<CardHeader className="flex flex-row items-center justify-between py-8 border-b">
			<LyricHeaderTitle />
			<div className="flex items-center gap-3">
				<ExternalLyricsButton />
				<PreviewButton />
				<DownloadButton />
			</div>
		</CardHeader>
	);
}

const LyricHeaderTitle = memo(function LyricHeaderTitle() {
	return (
		<div className="flex items-center justify-between">
			<CardTitle className="flex items-center gap-2">
				<Music className="h-5 w-5 text-primary" />
				Lyric Preview
			</CardTitle>
		</div>
	);
});

function ExternalLyricsButton() {
	const { showExternalLyrics, setShowExternalLyrics, showPreview } =
		useLyricStudioStore(
			useShallow((state) => ({
				showExternalLyrics: state.showExternalLyrics,
				setShowExternalLyrics: state.setShowExternalLyrics,
				showPreview: state.showPreview,
			}))
		);

	return (
		<Button
			onClick={() => setShowExternalLyrics(!showExternalLyrics)}
			variant="outline"
			className="gap-2"
			title="Import lyrics from text"
			disabled={showPreview}
		>
			<FileText className="h-4 w-4" />
			{showExternalLyrics ? 'Hide Lyrics' : 'External Lyrics'}
		</Button>
	);
}

function PreviewButton() {
	const {
		showPreview,
		setShowPreview,
		lyricLines,
		hasEmptyLyricLines,
		showExternalLyrics,
	} = useLyricStudioStore(
		useShallow((state) => ({
			showPreview: state.showPreview,
			setShowPreview: state.setShowPreview,
			lyricLines: state.lyricLines,
			hasEmptyLyricLines: state.hasEmptyLyricLines,
			showExternalLyrics: state.showExternalLyrics,
		}))
	);

	const isDisabled =
		lyricLines.length === 0 || hasEmptyLyricLines() || showExternalLyrics;

	return (
		<Button
			onClick={() => setShowPreview(!showPreview)}
			variant="outline"
			className="gap-2"
			title="Toggle lyrics preview"
			disabled={isDisabled}
			aria-label="Toggle lyrics preview"
		>
			<Eye className="h-4 w-4" />
			{showPreview ? 'Hide Preview' : 'Preview'}
		</Button>
	);
}

function DownloadButton() {
	const { lyricLines, hasEmptyLyricLines, generateLRC } = useLyricStudioStore(
		useShallow((state) => ({
			lyricLines: state.lyricLines,
			hasEmptyLyricLines: state.hasEmptyLyricLines,
			generateLRC: state.generateLRC,
		}))
	);

	const isDisabled = hasEmptyLyricLines() || lyricLines.length === 0;

	const handleDownload = () => {
		const lrcData = generateLRC();

		// Generate LRC content
		let lrcContent = `[ti:${lrcData.metadata.title}]\n`;
		lrcContent += `[ar:${lrcData.metadata.artist}]\n`;
		lrcContent += `[al:${lrcData.metadata.album}]\n\n`;

		// Add timestamp lines
		lrcData.metadata.timestamps.forEach(({ time, text }) => {
			lrcContent += `[${time}]${text}\n`;
		});

		// Create and trigger download
		const blob = new Blob([lrcContent], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'lyrics.lrc';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	return (
		<Button
			onClick={handleDownload}
			disabled={isDisabled}
			variant={isDisabled ? 'outline' : 'default'}
			className="gap-2"
			title={
				hasEmptyLyricLines()
					? 'Fill in all lyric lines before downloading'
					: 'Download lyrics in LRC format'
			}
		>
			<Download className="h-4 w-4" />
			Download
		</Button>
	);
}
