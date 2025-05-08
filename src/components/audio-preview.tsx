export function AudioPreview({ audioUrl }: { audioUrl: string }) {
	return (
		<div>
			<label className="mb-2 block text-sm font-medium">Preview</label>
			<audio
				src={audioUrl}
				controls
				className="w-full rounded-md border"
			/>
		</div>
	);
}
