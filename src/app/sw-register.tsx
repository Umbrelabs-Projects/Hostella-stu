'use client';

import { useEffect, useRef } from 'react';

export default function ServiceWorkerRegister() {
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator
    ) {
      const registerServiceWorker = async () => {
        try {
          // Check for existing registrations first
          const existingRegistrations = await navigator.serviceWorker.getRegistrations();
          
          // If there's already a registration for this scope, use it
          const existingRegistration = existingRegistrations.find(
            (reg) => reg.scope === window.location.origin + '/'
          );

          if (existingRegistration) {
            registrationRef.current = existingRegistration;
            console.log('[PWA] Using existing Service Worker registration');
            setupUpdateHandlers(existingRegistration);
            return;
          }

          // Register new service worker
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
          });

          registrationRef.current = registration;
          console.log(
            '[PWA] Service Worker registered successfully:',
            registration.scope
          );

          setupUpdateHandlers(registration);
        } catch (error: unknown) {
          // Handle invalid state error by unregistering and retrying
          const err = error as Error;
          if (err?.message?.includes('invalid state') || err?.name === 'InvalidStateError') {
            console.warn('[PWA] Service Worker in invalid state, cleaning up...');
            
            try {
              // Unregister all service workers
              const registrations = await navigator.serviceWorker.getRegistrations();
              await Promise.all(
                registrations.map((reg) => reg.unregister())
              );
              
              // Wait a moment, then try registering again
              setTimeout(() => {
                registerServiceWorker();
              }, 1000);
            } catch (cleanupError) {
              console.error('[PWA] Failed to cleanup service workers:', cleanupError);
            }
          } else {
            console.error('[PWA] Service Worker registration failed:', error);
          }
        }
      };

      const setupUpdateHandlers = (registration: ServiceWorkerRegistration) => {
        // Check for updates on page load (but don't force it)
        if (registration.update) {
          registration.update().catch(() => {
            // Silently fail - update check is optional
          });
        }

        // Check for updates periodically (every 10 minutes)
        if (updateIntervalRef.current) {
          clearInterval(updateIntervalRef.current);
        }

        updateIntervalRef.current = setInterval(() => {
          if (registration.update) {
            registration.update().catch(() => {
              // Silently fail - update check is optional
            });
          }
        }, 600000); // Check every 10 minutes

        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                // New service worker available, prompt user to refresh
                if (confirm('New version available! Reload to update?')) {
                  window.location.reload();
                }
              }
            });
          }
        });
      };

      // Handle service worker controller change
      let refreshing = false;
      const controllerChangeHandler = () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      };

      navigator.serviceWorker.addEventListener('controllerchange', controllerChangeHandler);

      // Register service worker
      registerServiceWorker();

      // Cleanup
      return () => {
        if (updateIntervalRef.current) {
          clearInterval(updateIntervalRef.current);
        }
        navigator.serviceWorker.removeEventListener('controllerchange', controllerChangeHandler);
      };
    }
  }, []);

  return null;
}

