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

  async register({ email, name, password }) {
    await wait(1000);

    return new Promise((resolve, reject) => {
      try {
        // Check if a user already exists
        let user = users.find((_user) => _user.email === email);

        if (user) {
          reject(new Error("User already exists"));
          return;
        }

        user = {
          id: createResourceId(),
          avatar: null,
          email,
          name,
          password,
          plan: "Standard",
        };

        users.push(user);

        const accessToken = sign({ userId: user.id }, JWT_SECRET, {
          expiresIn: JWT_EXPIRES_IN,
        });

        resolve(accessToken);
      } catch (err) {
        console.error("[Auth Api]: ", err);
        reject(new Error("Internal server error"));
      }
    });
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
