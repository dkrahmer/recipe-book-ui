import { AuthTokenKey } from "../config";
import { createAxiosApi } from "../Helpers/axiosApiHelper";
import { UserContext } from "../Contexts/UserContext";
import { useContext } from "react";
import { DateTime } from "luxon";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";

export function useUserContext() {
  const [user, triggerResetUserFromToken] = useContext(UserContext);

  function login(newAuthToken, handleResponse) {
    const body = {
      token: newAuthToken
    };

    createAxiosApi("Auth", user)
      .post("/login", body)
      .then((response) => {
        if (response && response.status === 200 && response.data.token) {
          setUserToken(response.data.token);
          triggerResetUserFromToken();
          handleResponse(true);
        }
        else {
          logout();
          handleResponse(false);
        }
      })
      .catch((error) => {
        console.log(error.response);
        logout();
        handleResponse(false);
      });
  }

  function logout() {
    removeUserToken();
    triggerResetUserFromToken();
  }

  return {
    login,
    logout,
    triggerResetUserFromToken,
    ...user
  };
}

function setUserToken(token) {
  const decodedToken = jwt.decode(token);
  const expireDate = DateTime.fromMillis(decodedToken.exp * 1000);

  Cookies.set(AuthTokenKey, token, { expires: expireDate.toJSDate() });
}

function removeUserToken() {
  Cookies.remove(AuthTokenKey);
}
