import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aether2D - HD-2D Game Asset Studio',
  description: 'AI Text-to-SVG and Text-to-Image-to-SVG generator creating production-ready HD-2D pixel and isometric game assets.',
  openGraph: {
    title: 'Aether2D - HD-2D Game Asset Studio',
    description: 'AI Text-to-SVG and Text-to-Image-to-SVG generator creating production-ready HD-2D pixel and isometric game assets.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aether2D - HD-2D Game Asset Studio',
    description: 'AI Text-to-SVG and Text-to-Image-to-SVG generator creating production-ready HD-2D pixel and isometric game assets.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-zinc-950 text-zinc-100 antialiased selection:bg-amber-500/30 selection:text-amber-200" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
