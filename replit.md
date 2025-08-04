# Solo Leveling Productivity App

## Overview

This is a Solo Leveling-themed personal productivity application that gamifies goal management and daily task completion. The application features a React frontend with TypeScript, a Node.js/Express backend, and Firebase integration for authentication and data storage. The app allows users to create and manage goals across different categories, track their progress, and level up their virtual character based on completion rates. The design emphasizes the Solo Leveling anime/manga aesthetic with dark themes, gradients, and gaming elements.

## Recent Updates (January 2025)

- **URL Routing System**: Implemented proper browser navigation with Wouter router, allowing natural back/forward button usage on mobile devices. Each section now has dedicated URLs (/dashboard, /settings, /calendar, /analytics, /notes, /streaks).

- **Service Worker Implementation**: Added comprehensive PWA functionality with offline support, background sync, and push notifications. Service Worker is properly configured for production deployment while being disabled in development environments to avoid security errors.

- **Enhanced Mobile Experience**: Complete category customization system allowing users to rename quest categories and Shadow Archive labels. Mobile-optimized layouts with responsive design patterns.

- **Development Notification System**: Created fallback browser notification system for development environments, ensuring notification functionality works across all deployment stages.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development tooling
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React hooks with custom hooks for Firebase integration and TanStack Query for server state
- **UI Components**: Radix UI primitives with custom styled components using Tailwind CSS
- **Styling**: Tailwind CSS with custom Solo Leveling theme colors and Orbitron font for headers
- **Form Handling**: React Hook Form with Zod validation schemas

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **API Design**: RESTful API structure with routes organized in `/api` prefix
- **Storage Interface**: Abstracted storage layer with both in-memory and database implementations
- **Development Setup**: Vite integration for full-stack development with HMR

### Authentication & Authorization
- **Provider**: Firebase Authentication with Google sign-in
- **Session Management**: Firebase Auth state management with React context
- **User Profiles**: Firestore documents for extended user data including level, XP, and rank

### Data Storage Solutions
- **Primary Database**: PostgreSQL with Drizzle ORM for schema management
- **Authentication**: Firebase Authentication with Google sign-in
- **User Data**: Firestore for user profiles, goals, categories, and statistics
- **Schema Design**: Normalized structure with users, categories, goals, and user_stats tables
- **Cross-Device Sync**: Firebase ensures data consistency across mobile and desktop devices
- **Development Database**: Local PostgreSQL for development, Firestore for user authentication and profile data

### Component Architecture
- **Layout Components**: Sidebar navigation, top bar, and responsive mobile design
- **Goal Management**: Category-based organization with collapsible sections and priority/status tracking
- **Calendar Integration**: Date-based goal planning and completion tracking
- **Analytics Dashboard**: Progress tracking with XP systems and streak counters
- **Morning Routine**: Automated prompts and goal entry modals

### Gaming System
- **Leveling Mechanism**: XP-based progression with configurable thresholds
- **Rank System**: E-Rank through S-Rank progression based on level milestones
- **Category Organization**: Main Mission, Training, and Side Quests with color-coded themes
- **Streak Tracking**: Daily completion streaks with visual indicators

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Router (Wouter), React Hook Form, React Query
- **Development Tools**: Vite, TypeScript, ESBuild for production builds
- **Node.js Backend**: Express.js, TSX for development server

### UI and Styling
- **Component Library**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS with PostCSS and Autoprefixer
- **Icons**: Lucide React for consistent iconography
- **Fonts**: Google Fonts (Inter, Orbitron) for Solo Leveling aesthetic

### Database and Authentication
- **Database**: PostgreSQL with Neon Database serverless hosting
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Authentication**: Firebase Auth with Firestore for user data
- **Session Storage**: Connect-pg-simple for PostgreSQL session storage

### Data Management
- **Validation**: Zod for schema validation and type safety
- **Date Handling**: date-fns for date manipulation and formatting
- **State Management**: TanStack React Query for server state caching

### Development and Deployment
- **Build Tool**: Vite with React plugin and runtime error overlay
- **Code Quality**: TypeScript with strict configuration
- **Environment**: Replit-specific plugins for development environment
- **Database Migrations**: Drizzle Kit for schema management and migrations