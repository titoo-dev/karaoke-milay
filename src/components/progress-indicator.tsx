import { Loader2 } from 'lucide-react';

export function ProcessingIndicator() {
	return (
		<div className="flex flex-col items-center justify-center rounded-lg bg-card p-8 text-center">
			<div className="relative">
				<div className="relative z-10">
					<Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
					<h3 className="mt-4 text-lg font-medium">
						Processing Audio
					</h3>
					<p className="mt-2 text-sm text-muted-foreground">
						This may take a few minutes depending on the file
						size...
					</p>
				</div>
			</div>
		</div>
	);
}
