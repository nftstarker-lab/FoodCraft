AI Rules and Stack Guide

Overview
This document describes the core tech stack used by the app and sets clear rules for which libraries to use for specific tasks to keep the codebase simple, consistent, and maintainable.

Tech Stack (5–10 bullet points)
- React 18 with TypeScript for building the UI with strong typing.
- Vite for fast development server and build tooling.
- React Router for client-side routing, with routes maintained in src/App.tsx.
- Tailwind CSS for utility-first styling and responsive design.
- shadcn/ui as the primary component library for accessible, well-styled UI components.
- Radix UI primitives for low-level, accessible unstyled components when a shadcn/ui component doesn’t fit.
- lucide-react for icons throughout the app.
- Supabase for auth, database, storage, and edge functions integration.
- Project organized by feature: UI components in src/components and pages in src/pages.

Library Usage Rules
Styling
- Use Tailwind CSS for all styling and layout; prefer utility classes over custom CSS.
- Ensure responsive design using Tailwind’s responsive utilities (sm, md, lg, xl).
- Only add custom CSS if a Tailwind pattern cannot reasonably handle the requirement.

Components
- Use shadcn/ui components as the default for UI (buttons, inputs, modals, tables, tabs, etc.).
- Do not modify shadcn/ui library files; wrap or extend via new components in src/components when customization is needed.
- When a specific component is not available in shadcn/ui, use Radix UI primitives to compose the needed behavior.

Icons
- Use lucide-react for all icons; choose icons from the lucide set rather than adding custom SVGs unless absolutely necessary.

Routing
- Use React Router exclusively for navigation; keep all route definitions in src/App.tsx.
- Organize pages under src/pages, and import them into src/App.tsx routes.

Notifications
- Use shadcn/ui’s toast utilities for user notifications (success, error, info).
- Keep toasts concise and actionable; avoid multiple simultaneous toasts for the same event.

Forms and Inputs
- Prefer shadcn/ui form-related components for inputs, selects, textareas, checkboxes, etc.
- Use simple controlled inputs and React hooks; avoid adding external form libraries unless a strong need arises.

State and Data Fetching
- Use React hooks (useState, useReducer, useEffect, useContext) for state management.
- Use the existing services/* files and the native fetch API for API calls; avoid introducing axios or other network libraries unless requested.

Auth, Database, and Storage
- Use Supabase for authentication, database operations, file storage, and serverless functions.
- If Supabase is not yet configured, add it via the integration button and configure environment variables as required before implementing auth or data features.

Modals, Dialogs, and Overlays
- Use shadcn/ui Dialog, Sheet, and related overlay components for modals and side panels.
- Prefer composition and props over global state for controlling modal visibility.

Tables, Lists, and Data Display
- Use shadcn/ui Table and related components for tabular data.
- Only add virtualization libraries if performance requires it for very large lists.

Images and Media
- Use the standard img tag for images in this Vite/React setup; ensure alt text is provided for accessibility.
- Optimize images via external services or Supabase storage when needed.

General Rules
- Keep components small and focused; create a new file for each new component or hook in src/components.
- Do not introduce new npm packages without a clear need; ask first and document the reason if added.
- Maintain TypeScript types in types.ts or alongside components/services when appropriate.
- Follow existing project patterns and file organization to keep the codebase consistent.