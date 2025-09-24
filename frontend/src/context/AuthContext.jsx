// import { createContext, useContext, useState, useEffect } from "react";
// import api from "../services/api";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // check if already logged in (cookies / token)
//   useEffect(() => {
//     api.get("/auth/me")
//       .then(res => setUser(res.data.user))
//       .catch(() => setUser(null))
//       .finally(() => setLoading(false));
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, setUser, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }

import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if already logged in (cookies / token)
  useEffect(() => {
    api.get("/auth/me")
      .then(res => {
        const loggedUser = res.data.user;
        setUser(loggedUser);

        // Persist userId in localStorage for page refresh
        if (loggedUser?._id) {
          localStorage.setItem("userId", loggedUser._id);
        } else {
          localStorage.removeItem("userId");
        }
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem("userId");
      })
      .finally(() => setLoading(false));
  }, []);

  // Optional: helper to update user and localStorage together
  const updateUser = (newUser) => {
    setUser(newUser);
    if (newUser?._id) {
      localStorage.setItem("userId", newUser._id);
    } else {
      localStorage.removeItem("userId");
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser: updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
