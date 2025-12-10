/**
 * Script to clear all service workers from the browser
 * 
 * Run this in the browser console, or use this as a reference
 * to manually clear service workers via DevTools
 * 
 * Instructions:
 * 1. Open Chrome DevTools (F12)
 * 2. Go to Application tab
 * 3. Click "Service Workers" in the left sidebar
 * 4. Click "Unregister" for each service worker
 * 5. Or run this code in the Console tab
 */

if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    console.log(`Found ${registrations.length} service worker(s) to unregister`);
    
    Promise.all(
      registrations.map((registration) => {
        console.log(`Unregistering: ${registration.scope}`);
        return registration.unregister();
      })
    )
      .then(() => {
        console.log('✅ All service workers unregistered successfully!');
        console.log('Please refresh the page.');
      })
      .catch((error) => {
        console.error('❌ Error unregistering service workers:', error);
      });
  });
} else {
  console.log('Service Workers not supported in this environment');
}

