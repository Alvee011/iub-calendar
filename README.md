# IUB Academic Calendar 2026

An elegant, modern, and interactive academic calendar for Independent University, Bangladesh (IUB). This application provides students and faculty with a seamless way to view, filter, and track academic events throughout the year.

![App Screenshot](public/vite.svg)

## ✨ Features

- **Viewing Modes**:
    - **Month View**: Traditional calendar layout to see events at a glance.
    - **Semester View**: Organized breakdown of events by semester (Spring, Summer, Autumn).
    - **List View**: Chronological list of all upcoming events.

- **Smart Filtering**:
    - Filter events by **Semester** (Spring, Summer, Autumn).
    - Filter by **Event Type** (Admissions, Exams, Holidays, Administration, etc.).

- **Global Search**:
    - Instantly search for any event (e.g., "Midterm", "Eid", "Registration").
    - Jump directly to the specific month and event from search results.

- **Event Details**:
    - Click on any event to view detailed information in a modal.
    - See start dates, end dates, and specific notes.

- **Modern UI/UX**:
    - Responsive design for mobile and desktop.
    - Glassmorphism effects and smooth animations.
    - Interactive hover states and transitions.

## 🛠️ Tech Stack

- **Frontend Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Deployment**: [Vercel](https://vercel.com/)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Alvee011/iub-calendar.git
    cd iub-calendar
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```
    The app will open at `http://localhost:5173`.

## 📦 Building for Production

To create a production-ready build:

```bash
npm run build
```

This will generate a `dist` folder containing the optimized files for deployment.

## ☁️ Deployment

This project is configured for easy deployment on **Vercel**:

1.  Push your code to a GitHub repository.
2.  Import the project into Vercel.
3.  Vercel will automatically detect Vite and settings.
4.  Deploy!

## 📄 License

This project is open-source and available for personal and educational use but make sure to credit the original author. and if you want to use it for commercial purposes, please contact the original author.