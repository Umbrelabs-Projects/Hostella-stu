# PWA Setup Guide

This application is now configured as a Progressive Web App (PWA), allowing users to install it on their mobile devices and desktop browsers.

## Features Implemented

✅ **Web App Manifest** - Defines app metadata, icons, and display settings
✅ **Service Worker** - Enables offline functionality and caching
✅ **Install Prompt** - Users can install the app on their devices
✅ **Offline Support** - Basic offline functionality with caching
✅ **App Icons** - Multiple icon sizes for different devices

## Setup Instructions

### 1. Generate PWA Icons

Before deploying, you need to generate the required icon sizes from your logo:

**Option A: Using the provided script (Recommended)**

1. Install sharp (image processing library):
   ```bash
   npm install --save-dev sharp
   ```

2. Run the icon generation script:
   ```bash
   npm run generate-icons
   ```

This will generate all required icon sizes (72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512) from `public/logo.png` and save them to `public/icons/`.

**Option B: Manual Generation**

You can use online tools like:
- [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [PWA Builder](https://www.pwabuilder.com/imageGenerator)

Generate icons in these sizes and save them to `public/icons/`:
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

### 2. Test PWA Functionality

1. **Development Testing:**
   - Run `npm run dev`
   - Open Chrome DevTools → Application tab
   - Check "Service Workers" and "Manifest" sections
   - Test offline functionality

2. **Production Testing:**
   - Deploy to a server with HTTPS (required for PWA)
   - Open the site on a mobile device
   - Look for the "Add to Home Screen" prompt
   - Test installation and offline functionality

### 3. Customization

**Update App Information:**
- Edit `public/manifest.json` to change app name, description, theme color, etc.
- Update metadata in `src/app/layout.tsx`

**Customize Service Worker:**
- Edit `public/sw.js` to modify caching strategies
- Add custom offline pages or functionality

**Theme Color:**
- Current theme color: `#facc15` (yellow)
- Update in both `manifest.json` and `layout.tsx`

## Browser Support

- ✅ Chrome/Edge (Android & Desktop)
- ✅ Safari (iOS 11.3+)
- ✅ Firefox (Android & Desktop)
- ✅ Samsung Internet

## Installation on Different Devices

### Android (Chrome)
1. Visit the site
2. Tap the menu (3 dots)
3. Select "Add to Home screen" or "Install app"
4. Confirm installation

### iOS (Safari)
1. Visit the site
2. Tap the Share button
3. Select "Add to Home Screen"
4. Customize name if desired
5. Tap "Add"

### Desktop (Chrome/Edge)
1. Visit the site
2. Look for the install icon in the address bar
3. Click "Install" when prompted

## Requirements for Production

⚠️ **Important:** PWAs require HTTPS in production (except for localhost)

- Deploy to a server with SSL certificate
- Ensure all assets are served over HTTPS
- Test on actual devices, not just desktop browsers

## Troubleshooting

**Icons not showing:**
- Ensure all icon files exist in `public/icons/`
- Check that icon paths in `manifest.json` are correct
- Clear browser cache and service worker

**Service Worker not registering:**
- Check browser console for errors
- Ensure you're on HTTPS (or localhost)
- Verify `sw.js` is accessible at `/sw.js`

**Install prompt not appearing:**
- PWA must meet installability criteria:
  - HTTPS (or localhost)
  - Valid manifest.json
  - Registered service worker
  - Icons present
  - User has engaged with the site

## Additional Resources

- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev: PWA](https://web.dev/progressive-web-apps/)
- [Next.js PWA Documentation](https://nextjs.org/docs/app/api-reference/file-conventions/metadata)

