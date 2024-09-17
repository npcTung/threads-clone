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
        <Toaster />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

export default App;
