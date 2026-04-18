import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TidyWay | Professional Home Cleaning in London, Ontario',
  description:
    "London's most trusted home cleaning service. Professional, insured, and background-checked cleaners. Instant online pricing. Book in under 2 minutes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
