# EventProMobile
Mobile Development

## Role in the system
Expo/React Native app used by Frontmen at events. Frontmen log in with a temporary password issued by an Org Admin, select an assigned event, and use the live QR scanner to verify participants and mark their attendance in real time by calling `EventProWeb`'s scanner API.

## Tech Stack & Core Technologies
* **Framework:** React Native with Expo (Expo Router)
* **Language:** TypeScript
* **Camera & Scanning:** `expo-camera` (QR Code decoding)
* **Secure Storage:** `expo-secure-store` (for JWT auth tokens and offline session data)
* **Feedback:** `expo-haptics` (tactile vibration on successful/failed scans)
* **Networking:** Axios / Fetch API

### DevOps & Infrastructure
* **Architecture:** Multi-Repository (Decoupled Web & Mobile clients)
* **Database Hosting:** Supabase / Neon / AWS RDS (PostgreSQL)
* **Web Hosting:** Vercel
* **Mobile Distribution:** Expo Application Services (EAS Build)
* **Version Control:** Git & GitHub

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

## Database Design (Entity Relationship Diagram)

```mermaid
erDiagram
    ORGANIZATIONS ||--o{ USERS : "employs / contains"
    ORGANIZATIONS ||--o{ EVENTS : "hosts"
    ORGANIZATIONS ||--o{ PARTICIPANTS : "registers"

    USERS ||--o{ EVENTS : "creates (ORGANIZER)"
    USERS ||--o{ EVENT_FRONTMEN : "assigned to (FRONTMAN)"
    USERS ||--o{ EVENT_REGISTRATIONS : "scans & marks (FRONTMAN)"

    EVENTS ||--o{ EVENT_FRONTMEN : "assigns"
    EVENTS ||--o{ EVENT_REGISTRATIONS : "registers for"

    PARTICIPANTS ||--o{ EVENT_REGISTRATIONS : "receives invitation"

    ORGANIZATIONS {
        uuid id PK
        string name
        timestamp created_at
    }

    USERS {
        uuid id PK
        uuid organization_id FK
        string full_name
        string email UK
        string password_hash
        enum role "SYSTEM_ADMIN, ORG_ADMIN, ORGANIZER, FRONTMAN"
        boolean is_temporary_password
        timestamp created_at
    }

    EVENTS {
        uuid id PK
        uuid organization_id FK
        uuid created_by FK
        string name
        string location
        timestamp event_date
        timestamp created_at
    }

    EVENT_FRONTMEN {
        uuid event_id PK, FK
        uuid user_id PK, FK
        timestamp assigned_at
    }

    PARTICIPANTS {
        uuid id PK
        uuid organization_id FK
        string full_name
        string email
        string image_url
        timestamp created_at
    }

    EVENT_REGISTRATIONS {
        uuid id PK
        uuid event_id FK
        uuid participant_id FK
        string qr_token UK
        timestamp invitation_sent_at
        boolean attended
        timestamp attended_at
        uuid marked_by FK
    }