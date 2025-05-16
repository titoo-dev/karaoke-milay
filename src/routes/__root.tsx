import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';

import type { QueryClient } from '@tanstack/react-query';
import { Header } from '@/components/header';
import { Toaster } from 'sonner';
import { AudioProvider } from '@/context/audio-ref-context';

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: () => (
		<AudioProvider>
			<Header />
			<main className="flex container mx-auto min-h-[calc(100vh - 1vh)] flex-col bg-gradient-to-b from-background to-background/90">
				<Outlet />
				<Toaster />
			</main>
		</AudioProvider>
	),
});
