'use client';

import { useEffect, useState } from 'react';

interface ScreenReaderAnnouncementProps {
  message: string | null;
  timeout?: number;
  priority?: 'polite' | 'assertive';
}

export default function ScreenReaderAnnouncement({
  message,
  timeout = 3000,
  priority = 'polite',
}: ScreenReaderAnnouncementProps) {
  const [announcement, setAnnouncement] = useState<string | null>(null);

  useEffect(() => {
    if (message) {
      setAnnouncement(message);
      const timer = setTimeout(() => {
        setAnnouncement(null);
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [message, timeout]);

  if (!announcement) return null;

  return (
    <div
      className="sr-only"
      role="status"
      aria-live={priority}
      aria-atomic="true"
    >
      {announcement}
    </div>
  );
}
