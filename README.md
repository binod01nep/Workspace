# Workspace App

A modern React dashboard-style application built with Vite, React Router, and Tailwind CSS. The app includes a responsive layout, authentication flow, theme support, project and task views, messaging, analytics, people management, and profile/settings screens.

## Features

- Dashboard and overview screens
- Project management and project detail pages
- Task board and submissions views
- Messaging interface
- People and analytics pages
- Profile and settings views
- Light/dark theme support
- Mocked app and auth context for UI flow

## Tech Stack

- React 19
- Vite
- React Router DOM
- Tailwind CSS
- Recharts
- Lucide React
- @hello-pangea/dnd for drag-and-drop interactions

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open the local Vite URL shown in the terminal.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

## Project Structure

- `src/components` - Shared UI components such as layout and navigation
- `src/contexts` - Application, authentication, and theme providers
- `src/views` - Main pages and route-based screens
- `src/data` - Mock data used by the app
- `src/lib` - Utility helpers

## Notes

This project is currently configured as a front-end UI demo with mock data and client-side routing.
