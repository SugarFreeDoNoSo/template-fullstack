import { ThemeProvider } from '@/components/theme-provider';
import { TrpcProvider } from '../trpc/provider';
import './globals.css';

export const metadata = {
  title: 'Service Management Dashboard',
  description:
    'Modern service management application built with NextJS 15, shadcn/ui, and tRPC',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <TrpcProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </TrpcProvider>
      </body>
    </html>
  );
}
