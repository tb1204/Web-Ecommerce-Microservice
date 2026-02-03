import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { viLocalization } from "./locales/clerk-vi.ts";

const clerk_key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (clerk_key) {
  console.log("lay duoc key");
} else {
  throw new Error("key was not found");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerk_key} localization={viLocalization}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ClerkProvider>
  </StrictMode>,
);
