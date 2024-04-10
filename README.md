# Remix Recipes

- [Remix Docs](https://remix.run/docs)

## Getting Started

1. Adding required environment variables

   ```
   DATABASE_URL=YOUR-POSTGRES-CONNECTION-STRING

   AUTH_COOKIE_SECRET=YOUR-COOKIE-SECRET

   MAGIC_LINK_SECRET=YOUR-MAGIC-LINK-SECRET

   ORIGIN=http://localhost:3000

   BREVO_API_KEY=YOUR-BREVO-API-KEY
   ```

2. From your terminal:

   ```sh
   npm install
   ```

3. Start the Postgres instance
4. Modify .env for Postgres connection
5. Push Prisma schema to Postgres
   ```sh
   npx prisma db push
   ```
6. Seed the initial pantry data
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

- [Remix](https://remix.run): A full-stack web framework for building modern JavaScript applications.
- [Prisma](https://www.prisma.io): A modern database toolkit for TypeScript and Node.js that makes it easy to work with databases.
- [Magic Link Authentication](https://postmarkapp.com/blog/magic-links): A passwordless authentication method that allows users to log in with a single click using a secure email link.
- [Brevo](https://brevo.com): A SaaS solution used for sending email for magic link authentication in this project.
- [Typescript](https://www.typescriptlang.org): A typed superset of JavaScript that compiles to plain JavaScript.
- Optimistic UI: A technique for providing a smooth user experience by immediately updating the UI optimistically, without waiting for the server response.

## Notes

### Authorization Rules of the Login Page

| Action | Entity           | Condition     | Response         |
| ------ | ---------------- | ------------- | ---------------- |
| read   | login page       | not logged in | redirect to /app |
| create | magic link email | not logged in | redirect to /app |

### Authorization Rules of the Pantry Page

| Action | Entity            | Condition | Response                                    |
| ------ | ----------------- | --------- | ------------------------------------------- |
| CRUD   | pantry/shelf/item | logged in | redirect to /login                          |
| read   | shelves/items     | owned     | N/A (only display shelves/items user owned) |
| create | shelf             | owned     | N/A (user cannot create shelf for others)   |
| create | item              | owned     | N/A (user cannot create item for others)    |
| delete | shelf             | owned     | throw error response                        |
| delete | item              | owned     | throw error response                        |
| update | shelf             | owned     | throw error response                        |
