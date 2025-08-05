# Solo Leveling Productivity App

## Overview

This is a Solo Leveling-themed personal productivity application that gamifies goal management and daily task completion. The application features a React frontend with TypeScript, a Node.js/Express backend, and Firebase integration for authentication and data storage. The app allows users to create and manage goals across different categories, track their progress, and level up their virtual character based on completion rates. The design emphasizes the Solo Leveling anime/manga aesthetic with dark themes, gradients, and gaming elements.

## Recent Updates (August 2025)

### **Production-Ready Migration (August 2025)**
- **Complete Firebase Architecture**: Removed PostgreSQL backend entirely, now 100% Firebase Firestore for production scalability and real-time data sync
- **Optimized Authentication**: Switched to redirect-based Google sign-in for better mobile performance and production reliability
- **Production Security**: Added comprehensive Firestore Security Rules, input validation, sanitization, and rate limiting for enterprise-grade security
- **Error Handling**: Implemented React Error Boundaries, comprehensive error states, and user-friendly error messages throughout the app
- **Performance Optimization**: Removed development logging, optimized Firebase connections, and eliminated service worker conflicts
- **Professional Hooks**: Created type-safe Firebase integration hooks with automatic cache invalidation and optimistic updates
- **Input Validation**: Added Zod schemas for all user inputs with XSS protection and data sanitization

### **Previous Updates**
- **URL Routing System**: Implemented proper browser navigation with Wouter router, allowing natural back/forward button usage on mobile devices. Each section now has dedicated URLs (/dashboard, /settings, /calendar, /analytics, /notes, /streaks).
- **Service Worker Implementation**: Added comprehensive PWA functionality with offline support, background sync, and push notifications. Service Worker is properly configured for production deployment while being disabled in development environments to avoid security errors.
- **Enhanced Mobile Experience**: Complete category customization system allowing users to rename quest categories and Shadow Archive labels. Mobile-optimized layouts with responsive design patterns.
- **Complete PWA Implementation**: Full Progressive Web App functionality with Service Worker, offline support, install prompts, and native app behavior. Service Worker automatically activates on HTTPS deployment with comprehensive caching and background sync capabilities.

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
- **Architecture**: Pure client-side Firebase integration - no backend server required
- **Primary Data Layer**: Firebase Firestore with direct client SDK integration for all operations
- **Real-time Data**: Firebase real-time listeners for live updates across all components
- **Authentication**: Firebase Auth with Google OAuth - redirect-based for production reliability
- **Security**: Comprehensive Firestore Security Rules, input validation, rate limiting, and error handling
- **Performance**: Optimized Firebase connections, minimal bundle size, production-ready configuration

### Authentication & Authorization
- **Provider**: Firebase Authentication with Google sign-in
- **Session Management**: Firebase Auth state management with React context
- **User Profiles**: Firestore documents for extended user data including level, XP, and rank

### Data Storage Solutions
- **Primary Database**: Firebase Firestore for all user data, real-time sync, and offline support
- **Authentication**: Firebase Authentication with Google sign-in and secure session management
- **User Data**: Firestore collections for users, goals, categories, notes, settings, and analytics
- **Security**: Comprehensive Firestore Security Rules ensuring data isolation per user
- **Real-time Features**: Live data synchronization across all devices and sessions
- **Offline Support**: Firebase handles offline data caching and sync when reconnected
- **Backup Strategy**: Firebase automatic backups with export capabilities

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
- **Database**: Firebase Firestore with automatic scaling and global distribution
- **Authentication**: Firebase Auth with Google OAuth and secure token management  
- **User Data**: Firestore for all user profiles, preferences, and application data
- **Session Management**: Firebase Auth handles session persistence and security
- **Security Rules**: Comprehensive Firestore Security Rules ensuring user data isolation

### Data Management
- **Validation**: Zod for schema validation and type safety
- **Date Handling**: date-fns for date manipulation and formatting
- **State Management**: TanStack React Query for server state caching

### Development and Deployment
- **Build Tool**: Vite with React plugin and runtime error overlay
- **Code Quality**: TypeScript with strict configuration
- **Environment**: Replit-specific plugins for development environment
- **Database Migrations**: Drizzle Kit for schema management and migrations