import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./page/App.jsx";
import { BrowserRouter } from "react-router";
// context
import { TodoProvider } from "./contexts/todo/todoContext.jsx";
import { CategoryProvider } from "./contexts/category/categoryContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TodoProvider>
      <CategoryProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CategoryProvider>
    </TodoProvider>
  </StrictMode>
);
