import { Navigate } from "react-router-dom";

// 보호라우트 => 페이지가 렌더링 되기 전 토큰을 확인해서 차단
// 토큰 확인 -> 없으면 이동 / 있으면 Mypage 렌더링
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
