import { AudioLines } from 'lucide-react';
import { Button } from '../ui/button';
import { useTrackPlayerStore } from '@/stores/track-player/store';
import { useShallow } from 'zustand/react/shallow';

export const WaveFormToggleButton = () => {
	const { isWaveformVisible, toggleWaveform } = useTrackPlayerStore(
		useShallow((state) => ({
			isWaveformVisible: state.isWaveformVisible,
			toggleWaveform: state.toggleWaveform,
		}))
	);

	return (
		<Button
			variant={isWaveformVisible ? 'default' : 'ghost'}
			size="icon"
			className="h-8 w-8 rounded-full"
			onClick={toggleWaveform}
			title={isWaveformVisible ? 'Hide waveform' : 'Show waveform'}
		>
			<AudioLines className="h-4 w-4" />
		</Button>
	);
};
