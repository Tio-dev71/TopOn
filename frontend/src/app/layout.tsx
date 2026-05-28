import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'TopOn — Nền tảng Influencer Marketing hàng đầu Việt Nam',
  description: 'Kết nối thương hiệu với Reviewer, KOL & Creator hiệu quả hơn. Triển khai chiến dịch review, đo lường hiệu quả và tỷ lệ chuyển đổi cao.',
  keywords: 'influencer marketing, KOC, reviewer, KOL, chiến dịch, thương hiệu, TopOn',
  openGraph: {
    title: 'TopOn — Influencer Marketing Platform',
    description: 'Kết nối thương hiệu với Reviewer, KOL & Creator',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
