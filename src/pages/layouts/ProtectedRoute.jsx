import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken"); // Check if user is logged in

  return accessToken ? children : <Navigate to="/auth/login" replace />;
};

export default ProtectedRoute;
