# Lachlan Mortgage Staff Management System

A modern web application for managing staff members at Lachlan Mortgage, built with React and TypeScript.

## Features

- 📊 Staff Management Dashboard
- 🔐 Secure Authentication System
- 👥 Public Team Display
- 📱 Responsive Design
- ✨ Modern UI/UX

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- React Router
- Local Storage for Data Persistence

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/OnyxJack55/LachlanMortgage.git
cd LachlanMortgage
```

2. Install dependencies:
```bash
npm install
```

3. Set up secure configuration:
```bash
cp src/config/secure.config.template.ts src/config/secure.config.ts
```
Then edit `secure.config.ts` with your credentials.

4. Start the development server:
```bash
npm start
```

## Security Features

- Password Requirements:
  - Minimum 12 characters
  - Uppercase and lowercase letters
  - Numbers
  - Special characters
- Account lockout after 5 failed attempts
- Secure token generation
- Password salting

## Project Structure

```
src/
├── components/     # React components
├── config/        # Configuration files
├── context/       # React context providers
├── pages/         # Page components
├── services/      # Service layer
└── types/         # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is private and proprietary to Lachlan Mortgage.

## Contact

For any inquiries, please reach out to the development team.
