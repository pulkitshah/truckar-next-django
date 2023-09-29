import axios from "../utils/axios";
import { createResourceId } from "../utils/create-resource-id";
import { sign, decode, JWT_SECRET, JWT_EXPIRES_IN } from "../utils/jwt";
import { wait } from "../utils/wait";

class AuthApi {
  async login({ email, password }) {
    try {
      const response = await axios.post(`/api/user/token/`, {
        email,
        password,
      });

      return {
        status: response.status,
        data: response.data.token,
        error: false,
      };
    } catch (err) {
      console.error("[Auth Api]: ", err);
      if (err) {
        return {
          status: 400,
          data: err,
          error: "The email or password is wrong. Please check and try again. ",
        };
      }
    }
  }

  async register({ mobile, email, name, password }) {
    try {
      const response = await axios.post(`/api/user/create/`, {
        mobile,
        email,
        name,
        password,
      });

      return {
        status: response.status,
        data: response.data,
        error: false,
      };
    } catch (err) {
      console.error("[Auth Api]: ", err);
      if (err.email) {
        return {
          status: err.status,
          data: err,
          error:
            "This email id is already registered. Please try a different email.",
        };
      }
    }
  }

  async me() {
    try {
      const response = await axios.get(`/api/user/me/`);

      return {
        status: response.status,
        data: response.data,
        error: false,
      };

      // return response.data;
    } catch (err) {
      console.error("[Auth Api]: ", err);
      if (err.detail) {
        return {
          status: err.status,
          data: err,
          error: "This token is invalid. Please log in again",
        };
      }
    }
  }
}

export const authApi = new AuthApi();
