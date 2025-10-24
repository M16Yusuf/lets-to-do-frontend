import { createContext, useReducer } from "react";

const TodoContext = createContext();

const initialState = {
  todos: [],
  loading: false,
  error: null,
};

function todoReducer(state, action) {
  switch (action.type) {
    case "FETCH_TODOS_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_TODOS_SUCCESS":
      return { ...state, loading: false, todos: action.payload };
    case "FETCH_TODOS_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  async function fetchTodos(param) {
    dispatch({ type: "FETCH_TODOS_REQUEST" });
    try {
      const res = await fetch(`http://127.0.0.1:3000/api/todos?${param}`);
      const data = await res.json();
      dispatch({ type: "FETCH_TODOS_SUCCESS", payload: data });
    } catch (err) {
      dispatch({ type: "FETCH_TODOS_FAILURE", payload: err.message });
    }
  }

  return (
    <TodoContext.Provider value={{ ...state, fetchTodos }}>
      {children}
    </TodoContext.Provider>
  );
}

export default TodoContext;
