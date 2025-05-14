import { memo } from 'react';

export const Footer = memo(() => {
	return (
		<footer className="border-t py-6">
			<div className="container flex mx-auto max-w-sm flex-col items-center justify-around gap-4 md:flex-row">
				<p className="text-center text-sm text-muted-foreground">
					&copy; {new Date().getFullYear()} Karaoke Milay • Developed
					by titoo-dev
				</p>
				<div className="flex items-center gap-4">
					<a
						href="#"
						className="text-sm text-muted-foreground hover:text-foreground"
					>
						Contact
					</a>
				</div>
			</div>
		</footer>
	);
});
