# Opinion Onboard

A modern, minimal web application for sharing and voting on anonymous or named opinions.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Lucide React

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run the development server**:
    ```bash
    npm run dev
    ```

3.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

- `src/app`: Page routes and layouts (App Router).
    - `(public)`: Public facing pages (Home, Categories, Post).
    - `(auth)`: Authentication pages (Login, Signup).
    - `admin`: Admin dashboard and management pages.
- `src/components/ui`: Reusable UI components (Cards, Modals, Buttons).
- `src/lib`: Utilities and mock data.

## Features (Part 1)

- **Responsive Design**: Mobile-first layout adaptable to all screen sizes.
- **Vote System**: Interactive (visual-only) upvote/downvote buttons.
- **Reporting**: Modal interface for reporting content.
- **Admin Panel**: Dashboard with stats and moderation tools.
- **Mock Data**: Realistic sample data for demonstration.

## License

MIT
