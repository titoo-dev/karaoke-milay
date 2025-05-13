import { cn } from '@/lib/utils';

interface TabsProps {
	activeTab: 'upload' | 'youtube';
	onTabChange: (tab: 'upload' | 'youtube') => void;
	isDisabled: boolean;
}

export function Tabs({ activeTab, onTabChange, isDisabled }: TabsProps) {
	return (
		<div className="mb-8">
			<div className="inline-flex items-center justify-center rounded-lg border border-border bg-card p-1.5 shadow-sm">
				<button
					onClick={() => onTabChange('upload')}
					className={cn(
						'inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
						activeTab === 'upload'
							? 'bg-primary text-primary-foreground shadow-sm'
							: 'text-muted-foreground hover:bg-muted',
						isDisabled && 'opacity-50 cursor-not-allowed'
					)}
					disabled={isDisabled}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className={cn(
							'mr-2.5 h-4 w-4',
							activeTab === 'upload'
								? 'text-primary-foreground'
								: 'text-primary'
						)}
					>
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
						<polyline points="17 8 12 3 7 8" />
						<line x1="12" y1="3" x2="12" y2="15" />
					</svg>
					File Upload
				</button>
				<button
					onClick={() => onTabChange('youtube')}
					className={cn(
						'inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ml-2',
						activeTab === 'youtube'
							? 'bg-primary text-primary-foreground shadow-sm'
							: 'text-muted-foreground hover:bg-muted',
						isDisabled && 'opacity-50 cursor-not-allowed'
					)}
					disabled={isDisabled}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className={cn(
							'mr-2.5 h-4 w-4',
							activeTab === 'youtube'
								? 'text-primary-foreground'
								: 'text-primary'
						)}
					>
						<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
						<path d="m10 15 5-3-5-3z" />
					</svg>
					YouTube
				</button>
			</div>
		</div>
	);
}
