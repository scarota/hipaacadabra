# Hipaacadabra

Hipaacadabra is a modern, healthcare-agnostic Personal Health Record (PHR) platform designed specifically for retail healthcare providers. It empowers retail healthcare organizations to offer their patients a seamless, secure, and user-friendly way to manage their health information across different care settings.

## Overview

Hipaacadabra bridges the gap between retail healthcare providers and their patients by providing:

- **Healthcare Agnostic Integration**: Seamlessly connects with various healthcare systems and EHRs
- **Retail-Focused Design**: Optimized for retail healthcare workflows and patient engagement
- **Patient-Centric PHR**: Comprehensive personal health record management
- **White-Label Solution**: Customizable branding for healthcare organizations
- **HIPAA Compliance**: Built with security and privacy at its core

## Technical Stack

A modern web application built with Next.js 15, TypeScript, and Prisma, featuring authentication and a clean, responsive UI.

## Features

- Next.js App Router architecture
- TypeScript for type safety
- Prisma ORM for database management
- Kinde Authentication integration
- TailwindCSS for styling
- ESLint and Prettier for code quality

## Prerequisites

- Node.js >= 18.17.0
- pnpm (recommended package manager)
- PostgreSQL database

## Getting Started

1. Clone the repository
2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up your environment variables:

   ```bash
   cp .env.example .env
   ```

   Fill in your environment variables in the `.env` file

4. Generate Prisma Client:

   ```bash
   npx prisma generate --sql
   ```

   This command reads your Prisma schema and generates your Prisma Client library

5. Start the development server:
   ```bash
   pnpm dev
   ```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm prettier` - Format code
- `pnpm prettier:check` - Check code formatting

## Project Structure

- `/app` - Next.js application routes and components
- `/prisma` - Database schema and migrations
- `/scripts` - Utility scripts
- `/public` - Static assets
- `/middleware.ts` - Authentication middleware

## License

This project is private and proprietary.
