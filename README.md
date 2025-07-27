# User Management

A modern, responsive user management UI built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- Full CRUD for users (create, read, update, delete)
- Debounced search and pagination
- Friendly Inter font and modern UI
- Zip code validation with live feedback
- Responsive design
- Comprehensive integration tests

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v22.17.1 recommended)
- [pnpm](https://pnpm.io/) (recommended, but you can adapt for npm/yarn)

> If you don't have pnpm installed, run:
> ```bash
> npm install -g pnpm
> ```

### Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Start the development server:**
   ```bash
   pnpm dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173).

3. **(Optional) Build for production:**
   ```bash
   pnpm build
   ```

4. **(Optional) Preview production build:**
   ```bash
   pnpm preview
   ```

5. **Run tests:**
   ```bash
   pnpm test:run
   ```

### API Requirements

- The app expects a backend API running at `http://localhost:3000` with endpoints:
  - `GET /users`
  - `POST /users`
  - `PATCH /users/:id`
  - `DELETE /users/:id`
  - `GET /zipcodes/validate/:zipCode` (for zip code validation)

## Project Structure

- `src/components/users/` — All user management UI (table, form, modal, etc.)
- `src/hooks/` — Custom React hooks for users, forms, and zip validation
- `src/services/` — API service layer
- `src/types/` — TypeScript types
- `src/test/` — Test setup, mocks, and integration tests

## Customization

- **Font:** Uses [Inter](https://rsms.me/inter/) for a modern, friendly look.
- **Styling:** Powered by Tailwind CSS, easy to customize in `tailwind.config.js`.
