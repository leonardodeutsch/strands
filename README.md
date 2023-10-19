# Strands

A full-stack Nextjs social media application that simulates well-known apps like Twitter/X and Threads. It includes features like user authentication, creating strands (posts), creating organizations, and much more.
Currently live, feel free to try it out [here](https://strands-sandy.vercel.app/)!

![](https://github.com/leonardodeutsch/project-gif-hosting/blob/main/StrandsCreateStrand.gif)

![](https://github.com/leonardodeutsch/project-gif-hosting/blob/main/StrandsFeatures.gif)

## Features
- **User Authentication** through [Clerk](https://clerk.com/). Currently enabled GitHub, Google or using your email as means to sign up.
- **Onboarding** process the first time you sign into the app. You can upload a picture, choose your name, and add a bio.
- **Create strands** (posts).
- Multi-level strands. Reply to strands with comments. You can also reply to comments with more comments.
- **Create communities** and invite other members. They will be notified through their e-mail and can accept or decline the invitation.
- **Manage communities** by adding or removing members as well as giving members admin privileges.
- Toggle a community so it shows a badge at the bottom of your strands or replies.
- Show when users reply to your strands or comments under the **Activity** tab.
- Use the **Search** tab to search through all signed up users and travel to their **Profile**.
- Use the **Communities** tab to search through all existing communities and travel to their **Community Profile**.
- Fully operational on mobile devices.

### Tablet View
![](https://github.com/leonardodeutsch/project-gif-hosting/blob/main/strandstabletview.png)

### Mobile View
![](https://github.com/leonardodeutsch/project-gif-hosting/blob/main/strandsmobileview.png)

## About the App
- Built with **Typescript** and **Nextjs**, taking advantage of its incredible capabilities from **server-side rendering** to folder structure navigation.
- Used **Clerk/nextjs** to implement user authentication.
- Used [Shadcn](https://ui.shadcn.com/) and [Radix](https://www.radix-ui.com/) to quickly implement different react components.
- Used [Uploadthing](https://uploadthing.com/) to upload user/community profile pictures.
- Forms implemented with **React Hook Form**.
- Implemented **Webhooks** with [Clerk](https://clerk.com/) and [Svix](https://www.svix.com/) to handle community events.
- Used [Zod](https://github.com/colinhacks/zod) for **schema validation**.
- Used **Tailwindcss** for most of the styling.
- **MongoDB** database with [Mongoose](https://mongoosejs.com/) as ODM.
- **Hosted/Deployed** on [Vercel](https://vercel.com/).
- Database hosted on **MongoDB Atlas**.

## Tech Stack
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

