import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// 서버에서 받아올 유저 정보 타입 정의
interface UserInfo{
    name: string;
    email: string;
}

export default function MyPage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 페이지가 처음 렌더링될 때 내 정보 가져오기
  // useEffect: 컴포넌트가 화면에 나타날 때 자동으로 실행되는 함수
  useEffect(() => {
    const fetchUserInfo = async () => {
      try{
        // localStorage에서 토큰 꺼내기
        const token = localStorage.getItem("accessToken");

        // 토큰 없으면 바로 로그인 페이지로 이동
        if (!token) {
          alert("로그인이 필요합니다.");
          navigate("/login");
          return;
        }

        // GET /api/user/me 요청 시 Authorization 헤더에 토큰 담기
        const res = await axios.get("/api/user/me", {
          headers: {Authorization: `Bearer ${token}`},
        });

        // 응답에서 유저 정보 저장
        setUserInfo(res.data);
      }catch(err: any){
        const status = err.response?.status;
        if(status === 401){
          alert("인증이 만료되었습니다. 다시 로그인해주세요.")
          navigate("/login");
        }else if(status === 403){
          navigate("/forbidden");
        }
        else{
          setError("서버 오류가 발생했습니다.");
        }
      }
    };
    fetchUserInfo();
  }, []); // [] 빈 배열 : 처음 한 번만 실행


  return (
    <div className="wrapper">
      <div className="mypage-card">
        <h1>마이페이지</h1>
        {/* 에러가 있으면 에러 메시지 표시 */}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {/* 유저 정보가 있으면 표시 */}
        {userInfo && (
          <div className="profile-info">
            <img width="128" height="128" src="https://img.icons8.com/color-pixels/64/lion.png" alt="lion"/>
            <h2>안녕하세요! {userInfo.name}님!</h2>
            <p>{userInfo.email}</p>

            <button className="primary-button">로그아웃</button>
          </div>
        )}
      </div>
    </div>
  );
}
