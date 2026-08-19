# EventProMobile
Mobile Development

## folder arch
```text
event-system-mobile/
├── .env.example
├── .gitignore
├── app.json                           # Expo configuration
├── package.json
├── tsconfig.json
│
├── assets/                            # Splash screens, app icons, sounds
│
├── src/
│   ├── app/                           # Expo Router (or src/navigation)
│   │   ├── _layout.tsx
│   │   ├── index.tsx                  # Splash / Redirect
│   │   ├── (auth)/
│   │   │   └── login.tsx              # Frontman login with temp pass
│   │   └── (main)/
│   │       ├── events.tsx             # Assigned Events selection list
│   │       └── scanner/
│   │           └── [eventId].tsx      # Live QR Scanner View
│   │
│   ├── components/                    # Mobile Components
│   │   ├── CameraOverlay.tsx          # Target frame & alignment guide
│   │   ├── ParticipantSheet.tsx       # Bottom sheet showing attendee profile & status
│   │   ├── StatusBadge.tsx
│   │   └── ui/                        # Base buttons, text inputs
│   │
│   ├── hooks/                         # Custom React Hooks
│   │   ├── useCameraPermission.ts
│   │   └── useAttendanceSync.ts
│   │
│   ├── services/                      # Network & Storage
│   │   ├── api.ts                     # Axios/Fetch client pointed to Web API
│   │   ├── authStorage.ts             # SecureStore wrapper for JWT
│   │   └── scannerService.ts          # Verify & Mark attendance requests
│   │
│   ├── types/                         # Mobile-side TypeScript definitions
│   │   ├── api.ts                     # Copied/Mirrored response types from Web
│   │   └── participant.ts
│   │
│   └── utils/
│       └── haptics.ts                 # Vibration feedback on scan

```