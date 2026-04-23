'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

export default function GHLChatWidget() {
  const pathname = usePathname();

  if (pathname === '/jobs-london') {
    return null;
  }

  return (
    <Script
      src="https://widgets.leadconnectorhq.com/loader.js"
      strategy="lazyOnload"
      data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
      data-widget-id="69ea2c0602b0b943db83509d"
    />
  );
}
