import { createContext, useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import { authApi } from "../api/auth-api";
import axios from "../utils/axios";

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const setSession = (accessToken) => {
  if (accessToken) {
    // console.log(`Token ${accessToken}`);
    localStorage.setItem("accessToken", accessToken);
    axios.defaults.headers.common["Authorization"] = `Token ${accessToken}`;
  } else {
    localStorage.removeItem("accessToken");
    delete axios.defaults.headers.common["x-auth-token"];
  }
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    // user: null,
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export const AuthContext = createContext({
  ...initialState,
  platform: "JWT",
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
});

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      const accessToken = window.localStorage.getItem("accessToken");

      if (accessToken) {
        setSession(accessToken);
        const response = await authApi.me();
        console.log(response);

        if (response.status === 200) {
          const user = response.data;
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          setSession(null);
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } else {
        setSession(null);
        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (email, password) => {
    const response = await authApi.login({ email, password });

    if (response.status === 200) {
      setSession(response.data);
      localStorage.setItem("accessToken", response.data);

      const response2 = await authApi.me();

      if (response2.status === 200) {
        const user = response2.data;
        dispatch({
          type: "LOGIN",
          payload: {
            user,
          },
        });
      } else {
        setSession(null);
        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    }
    return response;
  };

  const logout = async () => {
    localStorage.removeItem("accessToken");
    dispatch({ type: "LOGOUT" });
  };

  const register = async (mobile, email, name, password) => {
    const response = await authApi.register({ mobile, email, name, password });

    if (response.status === 201) {
      await login(email, password);
    }
    return response;
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        platform: "JWT",
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const AuthConsumer = AuthContext.Consumer;
