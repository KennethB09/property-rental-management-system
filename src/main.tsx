import App from "./App.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthContextProvider } from "./context/AuthContext.tsx";
import { ThemeProvider } from "@/components/themeProvider";
import { APIProvider } from "@vis.gl/react-google-maps";
import { AppProvider } from "./context/AppContext.tsx";
import { ApiProvider } from "./context/ApiContext.tsx";
import { ConversationProvider } from "./context/ConversationContext.tsx";
import { TenanciesProvider } from "./context/TenanciesContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAP_API}>
      <AuthContextProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <ApiProvider>
            <AppProvider>
              <ConversationProvider>
                <TenanciesProvider>
                  <App />
                </TenanciesProvider>
              </ConversationProvider>
            </AppProvider>
          </ApiProvider>
        </ThemeProvider>
      </AuthContextProvider>
    </APIProvider>
  </StrictMode>
);
