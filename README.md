# Bookly Mobile (Mobile-Programming-Frontend)

React Native (Expo) e-commerce app for the Bookly shop. Browse products, manage wishlist, checkout via SePay (VietQR) or COD, receive live order status updates via Socket.IO, and manage profile/addresses.

Repo: `https://github.com/levietkhanh189/Mobile-Programming`
Backend: `https://backend-production-9c18.up.railway.app/api`

## Tech Stack

- **Expo SDK 54** · React Native 0.81 · React 19
- **Expo Router 6** (file-based routing) with bottom tabs
- **NativeWind 4** (Tailwind for RN) + **React Native Paper** (Material Design 3)
- **Zustand** (persisted stores) + **TanStack React Query**
- **Axios** with JWT interceptor
- **Socket.IO client** for realtime order updates
- **AsyncStorage** for token + user persistence
- **Expo Google Fonts** (Poppins, Open Sans)

## Features

- Auth: login, register (OTP), forgot password (OTP), change password
- Profile: edit info, change email/phone with OTP verification, manage addresses
- Catalog: product list, categories, top sellers, discounts, related products, search
- Product detail with reviews + related items
- Cart (persisted) + wishlist
- Checkout with shipping address selection, coupon code, COD or SePay (VietQR)
- Order history + live status updates via Socket.IO
- Notifications center
- Light/dark theme with custom glassmorphism styling

## Quick Start

```bash
npm install
npm start                  # Expo dev server
```

Then scan the QR with Expo Go, or:

```bash
npm run android            # run on Android
npm run ios                # run on iOS (macOS only)
npm run web                # run in browser
npm run lint
```

### Point the app at a backend

Edit `services/api.ts` line 6:

```ts
// Production (default)
const API_BASE_URL = 'https://backend-production-9c18.up.railway.app/api';

// Local dev — use your machine IP for physical devices
// const API_BASE_URL = 'http://192.168.1.100:3000/api';
```

### Android APK builds

```bash
npm run build:apk          # release APK via scripts/build-apk.sh
npm run build:apk:debug
```

## Project Structure

```
app/                         # Expo Router routes
├── (tabs)/                  # Bottom tab screens: home, explore, cart, orders
├── _layout.tsx              # Providers: QueryClient → Theme → Paper → Stack
├── login.tsx, register.tsx, forgot-password.tsx
├── product/[id].tsx         # Product detail
├── order/[id].tsx           # Order detail
├── payment/                 # SePay QR flow
├── checkout.tsx, profile.tsx, wishlist.tsx, notifications.tsx
screens/                     # Screen components (thin routes → fat screens)
├── auth/, checkout/, order/, payment/, product/, profile/, notifications/, wishlist/
services/
├── api.ts                   # Axios instance + JWT interceptor + service modules
├── socket.ts                # Socket.IO client
├── storage.ts               # AsyncStorage wrapper
├── order-analytics.ts, product-ranking.ts
stores/                      # Zustand (persisted)
├── authStore.ts, cartStore.ts, notificationStore.ts,
├── preferencesStore.ts, searchHistoryStore.ts
components/                  # Shared UI
hooks/                       # Custom hooks (theme, etc.)
```

## Conventions

- Route files in `app/` stay thin — UI lives in `screens/`
- Use `storageService` wrapper — never call AsyncStorage directly
- Use the service modules from `services/api.ts` — never call axios directly
- Layout/spacing via NativeWind `className`; interactive UI via Paper components
- Keep files under ~200 lines; split into focused modules

## Related Projects

- Backend API → `../Mobile-Programming-Backend`
- Admin dashboard → `../Mobile-Programming-Admin`

## License

Private / coursework.
