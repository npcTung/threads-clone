import React from "react";
import Router from "@/layout";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, Toaster } from "./components";
import { GoogleOAuthProvider } from "@react-oauth/google";

const App = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <ThemeProvider storageKey="vite-ui-theme">
          <Router />
        </ThemeProvider>
      </BrowserRouter>
      <Toaster position="bottom-right" richColors expand={false} closeButton />
    </GoogleOAuthProvider>
  );
};

export default App;
