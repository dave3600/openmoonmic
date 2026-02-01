# OpenMoonMic (OMm)

A web application for live music collaboration where users can connect and make music together in real-time.

## Features

- **Seed Phrase Authentication**: Crypto wallet-style 12-word seed phrase authentication
- **3D Globe Interface**: Interactive globe showing live users with zoom and navigation
- **Live Streaming**: WebRTC-based peer-to-peer audio/video streaming
- **Audio Playback**: Support for YouTube videos and local audio files
- **User Discovery**: Browse and link with other live users
- **Recording**: Record sessions directly to device (camera roll simulation)
- **Safety Features**: Block, report, and tag users

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Firebase**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Create a Realtime Database
   - Copy your Firebase config to `.env` file (see `.env.example`)

3. **Set Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase configuration
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/       # React components
│   ├── auth/        # Authentication components
│   ├── discovery/   # User discovery components
│   ├── globe/       # 3D globe components
│   ├── live/        # Live session components
│   ├── safety/      # Safety features
│   └── shared/      # Shared components
├── hooks/           # Custom React hooks
├── services/        # Service layers
│   ├── firebase/    # Firebase services
│   ├── webrtc/     # WebRTC services
│   └── recording/   # Recording services
├── stores/          # Zustand state stores
├── types/           # TypeScript types
└── utils/           # Utility functions
```

## Firebase Security Rules

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /reports/{reportId} {
      allow create: if request.auth != null;
      allow read: if false; // Admin only
    }
  }
}
```

### Realtime Database Rules
```json
{
  "rules": {
    "sessions": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "signaling": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "liveUsers": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

## Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Firebase** - Backend services
- **WebRTC** - Peer-to-peer streaming
- **globe.gl** - 3D globe visualization
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Future: Mobile App

This web app is designed to be converted to React Native for iOS and Android deployment.
