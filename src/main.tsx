import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { CarritoProvider } from "./context/CarritoContext.tsx";
import { CatalogoProvider } from "./context/CatalogoContext.tsx";
import { ToastProvider } from "./context/ToastContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CatalogoProvider>
            <CarritoProvider>
              <App />
            </CarritoProvider>
          </CatalogoProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
);
