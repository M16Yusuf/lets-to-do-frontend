import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./page/App.jsx";
import { TodoProvider } from "./contexts/todo/todoContext.jsx";
import { BrowserRouter } from "react-router";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TodoProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TodoProvider>
  </StrictMode>
);
