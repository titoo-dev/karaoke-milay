import { AudioWaveform } from 'lucide-react';
import { memo } from 'react';

export const Header = memo(() => {
	return (
		<header className="px-4 sticky top-0 z-50 w-full border-b bg-background/60 backdrop-blur">
			<div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
				<div className="flex items-center gap-2">
					<AudioWaveform className="h-6 w-6 text-primary" />
					<h1 className="text-xl font-bold text-foreground">
						Karaoke Milay
					</h1>
				</div>
			</div>
		</header>
	);
});
