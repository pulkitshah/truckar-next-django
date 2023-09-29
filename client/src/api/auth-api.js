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
    console.log(response)

    return response.data.token;
  } catch (err)  {
    console.error("[Auth Api]: ", err);
    return(new Error("Internal server error"));
  }
  }

  async register({ mobile, email, name, password }) {

    try {
      const response = await axios.post(`/api/user/token/`, {
        mobile,
        email,
        name,
        password,
      });
      console.log(response)

      return response.data.token;
    } catch (err)  {
      console.error("[Auth Api]: ", err);
      return(new Error("Internal server error"));
    }
  }

  async me() {
    try {
      const response = await axios.get(`/api/user/me/`);
      return response.data;
    } catch (err)  {
      console.error("[Auth Api]: ", err);
      return(new Error("Internal server error"));
    }
  }
}

export const authApi = new AuthApi();
