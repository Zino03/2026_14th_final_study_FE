import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MyPage from "./pages/MyPage";
import ForbiddenPage from "./pages/ForbiddenPage";
import ProtectedRoute from "./ProtectedRoute";

import "./App.css";


export default function App() {
  return (
    // BrowserRouter: 라우터 전체를 감싸는 컴포넌트 -> URL 변화 감지
    // Routes: 여러 Route 중 현재 URL과 일치하는 것 하나만 골라 보여줌
    // Route: 실제 URL에 매칭되는 페이지
    <BrowserRouter>
      <Routes>
        {/* 각 경로마다 보여줄 페이지 컴포넌트 연결
            / 경로는 /login으로 대체 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login/mypage" element={
          <ProtectedRoute>
          <MyPage />
          </ProtectedRoute>
        } />
        <Route path="/forbidden" element={<ForbiddenPage />} /> {/* 403 에러 페이지 */}
      </Routes>
    </BrowserRouter>
  );
}