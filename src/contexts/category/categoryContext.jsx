import { createContext, useReducer } from "react";

const CategoryContext = createContext();

const initialState = {
  categories: [],
  loading: false,
  error: null,
};

function categoryReducer(state, action) {
  switch (action.type) {
    case "FETCH_CATEGORIES_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_CATEGORIES_SUCCESS":
      return { ...state, loading: false, categories: action.payload };
    case "FETCH_CATEGORIES_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export function CategoryProvider({ children }) {
  const [state, dispatch] = useReducer(categoryReducer, initialState);

  async function fetchCategories() {
    dispatch({ type: "FETCH_CATEGORIES_REQUEST" });
    try {
      const res = await fetch("http://127.0.0.1:3000/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      dispatch({ type: "FETCH_CATEGORIES_SUCCESS", payload: data });
    } catch (err) {
      dispatch({ type: "FETCH_CATEGORIES_FAILURE", payload: err.message });
    }
  }

  return (
    <CategoryContext.Provider value={{ ...state, fetchCategories }}>
      {children}
    </CategoryContext.Provider>
  );
}

export default CategoryContext;
