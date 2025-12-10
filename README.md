# 🏡 Hostella Student Accommodation Platform

**Hostella** is a modern accommodation booking platform designed for students.  
It connects students with verified hostels in a secure, affordable, and user-friendly environment — making it easy to find, book, and manage accommodation with confidence.

**Status**: 🟡 Backend Integration in Progress - Infrastructure Complete

---

## ✨ What's New

This project has been fully prepared for backend API integration:

✅ **Complete API Service Layer** - All endpoints defined and typed  
✅ **Zustand State Management** - 13 stores ready for data management  
✅ **TypeScript Types** - Full type safety across the application  
✅ **Authentication Flow** - Login, signup, password reset implemented  
✅ **Protected Routes** - Next.js middleware for route protection  
✅ **UI Components** - Loading, error, and empty states  
✅ **Comprehensive Documentation** - API docs and integration guides  
✅ **Jest Test Suite** - 75 tests passing across 8 test suites (100% store coverage)  
✅ **Backend Integration Guide** - Complete guide for backend developer handoff

---

## 🧪 Testing

The project includes a comprehensive Jest test suite with 75 tests covering all Zustand stores:

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

**Test Organization:**
- `useAuthStore.test.ts` - Authentication & user management tests
- `useBookingStore.test.ts` - Booking operations tests
- `usePropertyStores.test.ts` - Hostel, room, and payment tests
- `useCommunicationStores.test.ts` - Chat and notification tests
- `useContentStores.test.ts` - Gallery, blog, FAQ, and testimonial tests
- `useUtilityStores.test.ts` - Password reset and UI state tests
- `platform.test.tsx` - Full platform integration tests
- `integration.test.ts` - API and cross-store integration tests

**Test Status**: ✅ All 75 tests passing  

---

## 🚀 Tech Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/docs)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) with persistence
- **Form Validation:** [Zod v4](https://zod.dev/) + [React Hook Form](https://react-hook-form.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) + Custom components
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **API Handling:** Custom REST API client with JWT authentication
- **Hosting:** [Vercel](https://vercel.com/) (recommended)
- **Currency:** All prices and amounts are in **Ghana Cedis (GHC) ₵**

---

## ⚙️ Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Umbrelabs-Projects/Hostella-stu.git
cd hostella-stu
```

### 2️⃣ Install dependencies
```bash
pnpm install
```

### 3️⃣ Configure environment variables

The `.env.local` file is already configured:

```env
NEXT_PUBLIC_API_URL=https://example-prod.up.railway.app/api/v1
```

### 4️⃣ Run the development server
```bash
pnpm dev
```


Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧩 Project Structure

```
src/
├── app/
│   ├── (auth)/              # Authentication pages (login, signup, password reset)
│   ├── (client)/            # Public pages (home, gallery, about, etc.)
│   ├── dashboard/           # Protected dashboard pages
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
├── components/
│   ├── ui/                  # Reusable UI components
│   ├── navbar/              # Navigation components
│   ├── footer/              # Footer components
│   └── hero/                # Hero section components
├── store/                   # ✅ Zustand stores (all API-ready)
│   ├── useAuthStore.ts      # Authentication & user management
│   ├── useHostelStore.ts    # Hostel listings
│   ├── useRoomStore.ts      # Room management
│   ├── useBookingStore.ts   # Booking operations
│   ├── usePaymentStore.ts   # Payment processing
│   ├── useChatStore.ts      # Chat functionality
│   └── ...                  # 12 total stores
├── lib/
│   ├── api.ts               # ✅ Complete API service layer
│   ├── utils.ts             # Utility functions
│   ├── images.ts            # Image imports
│   └── constants.tsx        # App constants
├── types/
│   ├── api.ts               # ✅ API type definitions
│   └── common.ts            # Common types
└── middleware.ts            # ✅ Route protection
```

---

## 💡 Core Features

### ✅ Implemented

- **🔐 Complete Authentication System**
  - Multi-step registration with file upload
  - Login/Logout with JWT
  - Password reset (3-step flow)
  - Session persistence
  - Protected routes

- **📊 State Management**
  - 12 Zustand stores for different features
  - Type-safe API integration
  - Loading and error states
  - Optimistic UI updates

- **🎨 Modern UI/UX**
  - Responsive design
  - Loading spinners
  - Error boundaries
  - Empty states
  - Toast notifications

- **🔒 Security**
  - JWT authentication
  - Protected routes via middleware
  - Secure token storage
  - CORS-ready

### 🚧 To Be Completed

- Replace dummy data in client pages
- Integrate dashboard features (bookings, chat, payments)
- Connect blog and FAQ pages
- Add real-time notifications
- Implement file uploads for bookings
- Add payment gateway integration

---

## 📚 Documentation

- **[API Documentation](./API_DOCUMENTATION.md)** - Complete API specification for backend developers
- **[Integration Guide](./INTEGRATION_GUIDE.md)** - Detailed integration instructions with code examples
- **[Quick Start](./QUICK_START.md)** - Quick reference guide for common tasks

---

## 🎯 Quick Examples

### Authentication
```tsx
import { useAuthStore } from '@/store/useAuthStore';

const { signIn, user, loading } = useAuthStore();

await signIn({ email, password });
```

### Fetching Data
```tsx
import { useHostelStore } from '@/store/useHostelStore';

const { hostels, loading, error, fetchHostels } = useHostelStore();

useEffect(() => {
  fetchHostels({ page: 1, limit: 10 });
}, []);
```

### Creating Bookings
```tsx
import { useBookingStore } from '@/store/useBookingStore';

const { createBooking } = useBookingStore();

const booking = await createBooking({
  hostelId: 1,
  roomId: 2,
  ...formData
});
```

---

## 🔑 Available Stores

All stores are production-ready with full API integration:

- `useAuthStore` - Authentication and user management
- `useHostelStore` - Hostel listings and details
- `useRoomStore` - Room availability
- `useBookingStore` - Booking management
- `usePaymentStore` - Payment processing
- `useNotificationsStore` - User notifications
- `useChatStore` - Chat messages
- `useTestimonialStore` - Customer testimonials
- `useGalleryStore` - Gallery images
- `useBlogStore` - Blog posts
- `useFAQStore` - FAQs
- `usePasswordResetStore` - Password reset flow

---

## 📦 Deployment

### Vercel (Recommended)

```bash
vercel deploy
```

### Manual Deployment

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

### Environment Variables

Make sure to set `NEXT_PUBLIC_API_URL` in your production environment.

---

## 🧪 Development

```bash
# Run development server
pnpm dev

# Run linter
pnpm lint

# Build for production
pnpm build
```

---

## 🤝 For Backend Developers

Please see **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** for:
- Complete endpoint specifications
- Request/Response formats
- Authentication requirements
- Error handling
- Validation rules

---

## 📋 Integration Checklist

- [x] Environment configuration
- [x] API service layer
- [x] Zustand stores
- [x] TypeScript types
- [x] Authentication flow
- [x] Protected routes
- [x] Loading/Error components
- [x] Comprehensive documentation
- [ ] Integrate testimonials page
- [ ] Integrate hostels listing
- [ ] Integrate gallery
- [ ] Integrate booking flow
- [ ] Integrate chat
- [ ] Integrate payments
- [ ] Add real-time updates
- [ ] Production testing

---

## 🤝 Contributing

We welcome contributions! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---
---

## 📄 License

This project is private and confidential.

---

## 💬 Contact & Support

**Umbrelabs Projects Team**
- 📧 Email: projects@umbrelabs.com
- 🌐 Website: www.hostella.com

For technical questions:
- Check the [Integration Guide](./INTEGRATION_GUIDE.md)
- Review the [API Documentation](./API_DOCUMENTATION.md)
- Open an issue on GitHub

---

## 🙏 Acknowledgments

- Next.js team for an amazing framework
- Zustand for simple and effective state management
- Radix UI for accessible components
- Tailwind CSS for utility-first styling

---

**Made with ❤️ by Umbrelabs Projects**

*Transforming student accommodation, one booking at a time.*

