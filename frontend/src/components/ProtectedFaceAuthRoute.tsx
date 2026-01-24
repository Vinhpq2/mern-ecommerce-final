import { Navigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

const ProtectedFaceAuthRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useUserStore();
  // Kiểm tra cờ xác thực trong sessionStorage (được set từ AuthenticationPage)
  const isFaceAuthenticated = sessionStorage.getItem("isFaceAuthenticated") === "true";

  console.log("ProtectedFaceAuthRoute - isFaceAuthenticated:", isFaceAuthenticated);
  console.log("children", children);
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!isFaceAuthenticated) {
    // Nếu chưa xác thực khuôn mặt, chuyển đến trang xác thực
    return <Navigate to="/face-authentication" />;
  }

  return children;
};

export default ProtectedFaceAuthRoute;