# AI Humanizer

A modern web application for humanizing AI-generated text, built with React and TypeScript.

## Project Overview

AI Humanizer is a powerful tool that helps transform AI-generated text into more natural, human-like content. It provides features for text transformation, project management, and user account management.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

Follow these steps to set up the project locally:

```sh
# Step 1: Clone the repository
git clone <REPOSITORY_URL>

# Step 2: Navigate to the project directory
cd ai-humanizer

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

The application will be available at `http://localhost:5173` by default.

## Development

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality
- `npm run type-check` - Run TypeScript type checking

### Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React context providers
├── hooks/         # Custom React hooks
├── integrations/  # Third-party service integrations
├── lib/           # Utility functions and helpers
├── pages/         # Page components
└── types/         # TypeScript type definitions
```

## Technologies Used

This project is built with:

- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with syntax for types
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components built with Radix UI and Tailwind CSS
- [Supabase](https://supabase.com/) - Open source Firebase alternative

## Features

- User authentication and authorization
- Project management
- Text humanization
- Subscription management
- Credit system
- Responsive design
- Modern UI/UX

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/rohan-darji/ai-humanizer/blob/main/LICENSE) file for details.
