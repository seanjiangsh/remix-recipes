# Remix Recipes

- [Remix Docs](https://remix.run/docs)

## Getting Started

1. From your terminal:

   ```sh
   npm install
   ```

2. Start the Postgres instance
3. Modify .env for Postgres connection
4. Push Prisma schema to Postgres
   ```sh
   npx prisma db push
   ```
5. Seed the initial pantry data
   ```sh
   npx prisma db seed
   ```

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Open Prisma studio for data management

```sh
npx prisma studio
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`

## This project utilizes the following technologies:

- [Remix](https://remix.run/): A full-stack web framework for building modern JavaScript applications.
- [Prisma](https://www.prisma.io/): A modern database toolkit for TypeScript and Node.js that makes it easy to work with databases.
- [Magic Link Authentication](https://magic.link/): A passwordless authentication method that allows users to log in with a single click using a secure email link.
- [Typescript](https://www.typescriptlang.org/): A typed superset of JavaScript that compiles to plain JavaScript.
- Optimistic UI: A technique for providing a smooth user experience by immediately updating the UI optimistically, without waiting for the server response.
