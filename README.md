#  Programmer's Board (LC-Board)

A modern, interactive Next.js application designed to seamlessly bridge the gap between algorithmic problem solving and visual brainstorming. Programmer's Board allows developers to read LeetCode problem statements and manually sketch out architecture, arrays, and algorithms on a side-by-side interactive whiteboard!

##  Features

- **Split-Pane Workspace**: A fluid, resizable interface that displays the raw LeetCode problem statement on one side, and an interactive digital whiteboard on the other.
- **Dynamic Content Fetching**: Instantly pull real LeetCode question data directly into your workspace via a dedicated GraphQL endpoint (`onrender.com`), automatically based on the URL ID parameter (`useParams`).
- **Persistent Local Board States**: Leverages client-side browser `localStorage` to quietly serialize and save your complex whiteboard drawings, ensuring your diagrams are completely restored even after page refreshes.
- **Secure Authenticaton Architecture**: Form structures are rigorously typed with `Zod`, controlled by `react-hook-form`, and wired through custom, modular `Firebase` utility wrappers handling the sign-in and sign-up flows.
- **Dynamic Client-Side Canvas**: Safely sidesteps Next.js Server-Side Rendering (SSR) constraints by dynamically booting the heavy HTML5 Excalidraw canvas strictly during browser execution (`next/dynamic`).

##  Technology Stack

- **Framework**: `Next.js 14` (App Router architecture)
- **Styling**: `Tailwind CSS` & `shadcn/ui` (Radix Primitives, Lucide Icons)
- **Whiteboard Engine**: `@excalidraw/excalidraw`
- **Validation & Forms**: `React-Hook-Form` + `Zod`
- **Auth/Backend Protocol**: SDK wrappers for `Firebase Authentication` & `Firestore`
- **Language**: `TypeScript`

##  Key Architecture Overview

*   **`app/problems/[genericpage]`**: The heavily manipulated, interactive core router. Relying on global document DOM tracking (`mousemove`/`mouseup`) to calculate fluid layout percentages and safely parsing external HTML strings into React Nodes without triggering Cross-Site-Scripting (XSS).
*   **`app/components/custom`**: The logical engine yard. Holds complex structural pieces like the Firebase utility wrappers (`firebase-utils`) enforcing the standard Separation of Concerns, and the dynamically-injected Canvas (`excalidrawWrapper`) that isolates drawing math away from standard React states.
*   **`app/components/ui`**: Stateless, highly reusable building blocks governed by Tailwind CSS merging protocols (`clsx` + `tailwind-merge`).

## Getting Started

First, run the development server locally to spin up the UI:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the results.
Note: You can instantly navigate to the core workspace by typing a problem ID directly into your URL like this: `http://localhost:3000/problems/1`!
