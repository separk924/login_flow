import { Outlet, Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
const cookies = new Cookies();

// receives component and any other props represented by ...rest
export default function ProtectedRoutes({ userData, allowedRoles }) {

  // get cookie from browser if logged in
  const token = cookies.get("TOKEN");
  if (!token) {
    // If there's no token, redirect to login
    return <Navigate to="/" />;
  }
  // Check if user has one of the allowed roles
  if (token && userData && allowedRoles.includes(userData.role) && userData.status === "Active") {
    return <Outlet />;  // Render the child components (protected content)
  } 
  else if(token && userData && allowedRoles.includes(userData.role) && userData.status === "Awaiting Approval") {
    console.log(userData);
    console.log(token);
    return <Navigate to="/awaiting-approval" />;  // Redirect to awaiting approval page
  }
  else if(!token && (!userData || userData.status === "Declined")){
    console.log(userData)
    return <Navigate to="/unauthorized" />;  // Redirect to unauthorized page
  }
}