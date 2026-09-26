<div align="center">
  <br />
    <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png" alt="LC Board Logo" width="100" />
  <br />
  <h1>Programmer's Board (LC-Board)</h1>
  <p>
    A modern, interactive workspace designed to seamlessly bridge the gap between algorithmic problem-solving and visual brainstorming. Read LeetCode problems and manually sketch out architectures, arrays, and algorithms on a side-by-side interactive whiteboard!
  </p>
</div>

##  Features

- **Split-Pane Workspace:** A fluid, resizable interface that displays the raw LeetCode problem statement on one side, and an interactive digital Excalidraw whiteboard on the other.
- **Problem Archive:** A dedicated, auth-gated library page that automatically aggregates and displays all your previously saved whiteboards, allowing you to instantly jump back into past problem-solving sessions.
- **Native Next.js GraphQL API:** Completely self-hosted backend API route that directly queries LeetCode's GraphQL server, eliminating reliance on unstable 3rd-party proxies or CORS workarounds.
- **Smart ID Resolution:** Forget memorizing slugs. Simply type a LeetCode problem number (e.g., `1`), and the backend intelligently resolves it to the correct problem slug using `lcid.cc` before fetching the content.
- **Firebase Sync & Auth:** Secure Authentication and Firestore Database integration. Your complex whiteboard drawings are automatically saved to the cloud under your secure `user.uid` so they are never lost.
- **Offline/Guest Fallbacks:** Leverages client-side browser `localStorage` to quietly serialize and save your board states if you prefer not to create an account.
- **Dynamic Client-Side Canvas:** Safely sidesteps Next.js Server-Side Rendering (SSR) constraints by dynamically booting the heavy HTML5 Excalidraw canvas strictly during browser execution (`next/dynamic`).

## 📸 Screenshots

| View 1 | View 2 | View 3 |
| :---: | :---: | :---: |
| <img src="./assets/Screenshot%202026-07-24%20230905.png" width="300" /> | <img src="./assets/Screenshot%202026-07-24%20230933.png" width="300" /> | <img src="./assets/Screenshot%202026-07-24%20230953.png" width="300" /> |

##  Technology Stack

- **Framework:** Next.js 14 (App Router Architecture)
- **Styling:** Tailwind CSS & shadcn/ui (Radix Primitives, Lucide Icons)
- **Whiteboard Engine:** `@excalidraw/excalidraw`
- **Validation:** React-Hook-Form + Zod (Strict numeric validation)
- **Database & Auth:** Firebase v10 SDK (Authentication & Firestore)
- **Language:** TypeScript

## 🧠 Core Architecture Flow

The application operates on a hybrid architecture, balancing Next.js Server-Side capabilities with heavy Client-Side interactions:

### 1. Data Fetching Pipeline (Backend)
To bypass browser CORS restrictions and securely query LeetCode, the app uses a custom Next.js Serverless Route (`app/api/leetcode/route.ts`) as a proxy. 
*   **Validation:** The route enforces strict numeric Zod validation to reject malicious inputs instantly.
*   **Resolution:** It hits `lcid.cc` to translate the raw numeric ID (e.g., `1`) into LeetCode's required `titleSlug` (e.g., `two-sum`).
*   **Querying:** It executes a GraphQL `POST` request to LeetCode's servers to fetch the raw HTML problem statement and serves it to the frontend.

### 2. Hybrid Rendering (Frontend)
Because the Excalidraw canvas relies heavily on browser APIs (`window`, `localStorage`), it cannot be Server-Side Rendered (SSR). 
*   The raw LeetCode HTML is fetched and parsed into React Nodes on the client.
*   The whiteboard is lazily loaded and injected dynamically (`next/dynamic`) to ensure Next.js hydration doesn't fail during the initial server render.

### 3. State Synchronization & Persistence
The whiteboard engine isolates drawing mathematics from standard React states to maintain 60FPS performance. 
*   **Debouncing:** As the user draws, the state is serialized into JSON. To prevent database spam, a debouncer waits for a 1-second pause in drawing before saving.
*   **Dual-Storage:** The JSON is immediately saved to the browser's `localStorage` (for guests/offline recovery) and simultaneously pushed to Firebase Firestore (under `/{user.uid}/{problemId}`) if the user is authenticated.
*   **Data Retrieval & Archiving:** Authenticated users have their own `/archive` library, which fetches all documents stored under their specific `user.uid` collection, generating a quick-access list of all previously solved problems.

## Getting Started

First, ensure you have your Firebase environment variables properly set up.

Then, run the development server locally:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open the local development URL (typically `http://localhost:3000`) with your browser to see the results.

### Quick Start
You can instantly navigate to the core workspace by typing a problem ID directly into your URL like this: `<your-local-url>/problems/1`!
