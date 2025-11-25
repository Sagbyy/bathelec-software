# Turborepo starter

This is an official starter Turborepo.

## Environment

You can find the environment variables in the `apps/web/.env.example` and `apps/api/.env.example` files.

```bash
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env
```

### Required Environment Variables

#### API (`apps/api/.env`)

- `DATABASE_POSTGRES_URL` - Connection string pour PostgreSQL (utilisé avec Prisma)
- `DATABASE_MONGO_URL` - Connection string pour MongoDB (utilisé avec Mongoose)
- `JWT_SECRET` - Secret pour la signature des tokens JWT
- `PORT` - Port d'écoute du serveur API (défaut: 3002)

#### Web (`apps/web/.env`)

- `NEXT_PUBLIC_API_URL` - URL de l'API backend
- `JWT_SECRET` - Secret pour la validation des tokens JWT (doit correspondre à celui de l'API)

## Run the project

```bash
pnpm install
```

```bash
cd packages/types
npm run build
```

```bash
turbo dev
```

### Database Setup

#### PostgreSQL (Prisma)

Le projet utilise Prisma comme ORM pour PostgreSQL. Les migrations et le schéma sont définis dans `apps/api/prisma/`.

```bash
# Générer le client Prisma
npx prisma generate

# Créer et appliquer les migrations
npx prisma migrate dev

# Ouvrir Prisma Studio (interface graphique pour la base de données)
npx prisma studio
```

#### MongoDB (Mongoose)

MongoDB est utilisé pour stocker les données non-relationnelles. La connexion est configurée automatiquement via `@nestjs/mongoose` dans le module principal de l'API.

Assurez-vous que la variable d'environnement `DATABASE_MONGO_URL` est correctement configurée dans `apps/api/.env`.

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `api`: a [NestJS](https://nestjs.com/) backend API
- `@repo/ui`: a React component library shared by both `web` and `docs` applications
- `@repo/types`: shared TypeScript types across the monorepo
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

## Architecture & Technologies

### Backend (API)

- **Framework**: [NestJS](https://nestjs.com/) - Progressive Node.js framework
- **Databases**:
  - **PostgreSQL** - Utilisé avec [Prisma](https://www.prisma.io/) comme ORM pour les données relationnelles (utilisateurs, dérivations)
  - **MongoDB** - Utilisé avec [Mongoose](https://mongoosejs.com/) via `@nestjs/mongoose` pour les données non-relationnelles (dérivations complétées)
- **Authentication**: JWT (JSON Web Tokens) avec Passport.js
- **API Documentation**: Swagger/OpenAPI
- **Validation**: class-validator et class-transformer
- **Password Hashing**: bcryptjs

### Frontend (Web)

- **Framework**: [Next.js](https://nextjs.org/) 14 avec App Router
- **UI Library**: [React](https://react.dev/) 18
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) avec animations
- **UI Components**: [Radix UI](https://www.radix-ui.com/) (composants accessibles)
- **State Management**:
  - [Zustand](https://zustand-demo.pmnd.rs/) pour l'état global
  - [TanStack Query](https://tanstack.com/query) (React Query) pour la gestion des données serveur
- **Forms**: [React Hook Form](https://react-hook-form.com/) avec validation [Zod](https://zod.dev/)
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Icons**: Lucide React

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Turborepo](https://turbo.build/repo) for monorepo build system and caching

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
pnpm dev
```

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## API Documentation

L'API expose une documentation Swagger accessible à l'adresse `/api` lorsque le serveur est en cours d'exécution. Cette documentation interactive permet de tester les endpoints et de voir les schémas de données.

## Development Tools

- **Package Manager**: [pnpm](https://pnpm.io/) 9.0.4
- **Node Version**: >= 18
- **Monorepo**: [Turborepo](https://turbo.build/repo) pour la gestion des builds et du cache
- **Testing**: Jest (configuré pour l'API)

## Deployment

Le projet est configuré pour être déployé sur :

- **Vercel** - Pour le frontend et l'API (configuration dans `apps/api/vercel.json`)
- **Railway** - Alternative de déploiement mentionnée dans la configuration CORS

Les variables d'environnement doivent être configurées dans les plateformes de déploiement correspondantes.

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
