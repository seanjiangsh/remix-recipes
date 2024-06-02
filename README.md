# Remix Recipes

A full-stack web application that provides users with an all-in-one chef experience where users can add recipes, create a meal plan, and generate a shopping list for your meals.

This project builds upon the [Remix Bootcamp: Zero to Mastery](https://zerotomastery.io/courses/learn-remix-run/) course, extending its scope. It utilizes the Architect framework for deployment on AWS Lambda and DynamoDB.

### [live demo](https://remix-recipes.sean-j.dev/)

## Getting Started

1. Make sure your AWS access key pair has been configured.
2. Adding required environment variables

   ```
   AUTH_COOKIE_SECRET=YOUR-COOKIE-SECRET

   MAGIC_LINK_SECRET=YOUR-MAGIC-LINK-SECRET

   ORIGIN=http://localhost:3000

   BREVO_API_KEY=YOUR-BREVO-API-KEY

   AWS_REGION=YOUR-AWS-REGION

   S3_STATIC_BUCKET=YOUR-S3-BUCKET
   ```

3. From your terminal:

   ```sh
   npm install
   ```

4. Please note the data will be seeding to AWS DynamoDB after dev server started

### Available scripts

| Script         | Description                                          |
| -------------- | ---------------------------------------------------- |
| npm run dev    | Start the development server (http://localhost:3000) |
| npm build      | Build the production-ready code                      |
| npm run deploy | Deploy production build to AWS                       |

## This project utilizes the following technologies:

- [Remix](https://remix.run): A full-stack web framework for building modern JavaScript applications.
- [Prisma](https://www.prisma.io): A modern database toolkit for TypeScript and Node.js that makes it easy to work with databases.
- [Magic Link Authentication](https://postmarkapp.com/blog/magic-links): A passwordless authentication method that allows users to log in with a single click using a secure email link.
- [Brevo](https://brevo.com): A SaaS solution used for sending email for magic link authentication in this project.
- [Typescript](https://www.typescriptlang.org): A typed superset of JavaScript that compiles to plain JavaScript.
- Optimistic UI: A technique for providing a smooth user experience by immediately updating the UI optimistically, without waiting for the server response.
