import { useContext } from "react";
import CategoryContext from "./categoryContext";

export const useCategories = () => useContext(CategoryContext);