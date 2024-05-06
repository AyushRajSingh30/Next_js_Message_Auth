# About Nextjs Edge Fameworker

This is edge time famework it mean Its server run as per user requirement application run as per user demand and some time database connection close. That why we connect database every ware but in core backend server run continously non stom that why we connect database only in single time.

# Package Used in Project

## Zod: A TypeScript Validation Package (npm zod | /schema/signUpSchema.ts)

Output;=>(success, data)
Zod is a third-party TypeScript validation package. It offers various functions for validating data, such as checking if an email is in the correct format using z.string().email(), which means the email type is a string and conforms to the email format.

For more validation examples and a better understanding, you can visit Zod on npm or check out the /schemas/signUpSchema.ts file.

Advantages of Zod:
In the core backend, we often have to write custom validation logic for every object, including email addresses, passwords, usernames, and more. Zod simplifies this process by providing a set of pre-built validation functions, saving time and effort in development.

## Next-Auth js  ()
  we meed to apply middleware on next-auth js add we also need to apply provider in this


# Instruction Provide by NextJs by default
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
