# Serena App

This is an [Expo](https://expo.dev) project for elderly care management, using React Native and Prisma ORM.

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Running the App (Expo)

Start the Expo development server:

```bash
npx expo start
```

You can then open the app in:
- [Expo Go](https://expo.dev/go) on your mobile device
- Android emulator
- iOS simulator
- Web browser (press `w` in the terminal)

### 3. Prisma Database Setup

This project uses [Prisma](https://www.prisma.io/) with SQLite for local development.

#### Configure the Database

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. (Optional) Edit `.env` to change the database location if needed.

#### Run Migrations

To create the database and apply the schema:

```bash
npm run prisma:migrate
```

#### Generate Prisma Client

```bash
npm run prisma:generate
```

#### Seed the Database

Populate the database with sample data:

```bash
npm run prisma:seed
```

## Project Scripts

- `npm run start` — Start Expo development server
- `npm run android` — Open on Android emulator
- `npm run ios` — Open on iOS simulator
- `npm run web` — Open in web browser
- `npm run lint` — Lint the project
- `npm run prisma:migrate` — Run Prisma migrations
- `npm run prisma:generate` — Generate Prisma client
- `npm run prisma:seed` — Seed the database

## Learn More

- [Expo documentation](https://docs.expo.dev/)
- [Prisma documentation](https://www.prisma.io/docs/)


## Build using EAS

```bash
npm install -g eas-cli
```

```bash
eas login
```

```bash
eas build:configure

```
```bash
eas build -p android --profile preview
```

