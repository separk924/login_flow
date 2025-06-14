import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { get } from 'aws-amplify/api';

const AuthContext = createContext({
  userData: null,
  isLoading: true,
  setUserData: () => {},
  getUserDetails: () => {},
  setIsLoading: () => {},
});

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const cookies = new Cookies();
  const token = cookies.get("TOKEN");

  useEffect(() => {
    if (token && !userData && isLoading) {
      getUserDetails();
    } else {
      setIsLoading(false); // Stop loading if no token or userData already fetched
    }
  }, [token]);

  const getUserDetails = async () => {
    try {
      const email = localStorage.getItem("EMAIL");
      if (!email) throw new Error("Email not found in localStorage");

      const account = get({
        apiName: "UserAPI",
        path: `/user/get-user-info?email=${encodeURIComponent(email)}`,
        options: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });

      const { body } = await account.response;
      const res = await body.json();
      console.log("User details GET call succeeded");
      setUserData(res);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      cookies.remove("TOKEN"); // Remove invalid token if necessary
    } finally {
      setIsLoading(false);
    }
  };

  const value = React.useMemo(() => ({
    userData,
    isLoading,
    setUserData,
    getUserDetails,
    setIsLoading,
  }), [userData, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};