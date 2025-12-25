'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Don't show prompt on dashboard or chat routes
    if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/chat')) {
      setShowPrompt(false);
      return;
    }

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // Check if user has permanently dismissed the prompt
    const permanentlyDismissed = localStorage.getItem('pwa-install-dismissed');
    if (permanentlyDismissed === 'true') {
      return;
    }

    // Check if prompt was shown recently (within last 7 days)
    const lastShown = localStorage.getItem('pwa-install-last-shown');
    if (lastShown) {
      const lastShownTime = parseInt(lastShown, 10);
      const now = Date.now();
      const daysSinceLastShown = (now - lastShownTime) / (1000 * 60 * 60 * 24);
      
      // Only show again after 7 days
      if (daysSinceLastShown < 7) {
        return;
      }
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
      // Store the current time when prompt is shown
      localStorage.setItem('pwa-install-last-shown', Date.now().toString());
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, [pathname]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Store current time so we can show again after interval
    localStorage.setItem('pwa-install-last-shown', Date.now().toString());
    // Only permanently dismiss if user explicitly dismisses multiple times
    // For now, just track the last shown time
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 animate-in slide-in-from-top-5">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-sm mb-1">Install Hostella</h3>
          <p className="text-xs text-gray-600 mb-3">
            Install our app for a better experience with offline access and faster loading.
          </p>
          <div className="flex gap-2">
            <Button
              onClick={handleInstall}
              className="h-8 text-xs bg-yellow-400 hover:bg-yellow-500 text-white"
            >
              Install Now
            </Button>
            <Button
              onClick={handleDismiss}
              variant="outline"
              className="h-8 text-xs"
            >
              Maybe Later
            </Button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

