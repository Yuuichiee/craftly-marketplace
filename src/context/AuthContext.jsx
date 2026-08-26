import { createContext, useContext, useReducer } from "react";

const INITIAL_STATE = {
  currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,
};

export const AuthContext = createContext(INITIAL_STATE);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { currentUser: action.payload };
    case "LOGOUT":
      return { currentUser: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  // Sync to localStorage whenever currentUser changes
  if (state.currentUser) {
    localStorage.setItem("currentUser", JSON.stringify(state.currentUser));
  } else {
    localStorage.removeItem("currentUser");
  }

  return (
    <AuthContext.Provider value={{ currentUser: state.currentUser, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
