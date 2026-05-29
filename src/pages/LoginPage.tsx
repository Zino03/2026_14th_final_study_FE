import { useState } from "react"; 
import { jwtDecode } from "jwt-decode"; // jwt 내용을 읽어오는 라이브러리
import { useNavigate } from "react-router-dom";
import axios from "axios";

// JWT payload 타입 정의
// jwtDecode 할 때 어떤 데이터가 들어있는지 타입스크립트에게 알려줌
interface DecodedToken{
  sub: number; // sub의 의미는 이 토큰이 누구 것인지 나타냄 (주로 유저 id)
  email: string;
  name: string;
  exp: number; // 만료 시각
}

export default function LoginPage() {
  const [email, setEmail] = useState(""); // 이메일
  const [password, setPassword] = useState(""); // 비밀번호
  const [error, setError] = useState(""); // 에러
  const [loading, setLoading] = useState(false); // 로딩 상태
  const navigate = useNavigate();

  /* async -> JS의 비동기 프로그래밍 문법인 async/await를 활용하는 것
  API 호출 시, 파일 읽기 등 시간이 걸리는 작업을 효과적으로 처리
  async를 함수 앞에 붙이면 함수가 항상 Promise를 반환하고
  await를 내부에 사용하여 Promise가 처리될 때까지 코드 실행을 멈추고 기다림 */

  // 로그인 버튼을 눌렀을 때 실행되는 함수
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => { 
    e.preventDefault();
    setError(""); // 에러 초기화 

    setLoading(true); // loading 상태
    try{
      // POST /api/auth/login 으로 이메일, 비밀번호 전송
      // try 안에서 요청을 보내고 성공하면 res에 응답이 담김
      const res = await axios.post("/api/auth/login", {
        email,
        password,
      });

      // 명세서에 맞게 변경 { "data": { "accessToken": "..." } }
      const rawToken =
        res.data.data.accessToken;

      // 토큰 잘 들어 왔는지 체크
      if (!rawToken) {
        alert('서버 응답에 토큰이 없습니다.');
        return;
      }

      // 헤더로 오는 경우 앞에 Bearer 자르기
      const token = rawToken.startsWith('Bearer ')
        ? rawToken.slice(7)
        : rawToken;

      console.log(token);

      // localStorage에 저장
      localStorage.setItem("accessToken", token);

      // JWT decode해서 payload 확인
      const decoded = jwtDecode<DecodedToken>(token);
      localStorage.setItem('userEmail', decoded.email);

      // 로그인 성공 시 마이페이지 이동
      navigate("/login/mypage");

    } catch(err: any){
      // 에러 응답 시
      const status = err.response?.status;
      console.log(status);

      if (status === 401){
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else{
        setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    } finally{
      setLoading(false); // 성공이든, 실패든 loading 해제
    }
  };

  return (
    <div className="wrapper">
      <div className="card">
        <h1>LOGIN</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {/* handleLogin 함수 연결 */}
        <form onSubmit={handleLogin}>
          <div className="input-style">
            <label>이메일</label>
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-style">
            <label>비밀번호</label>
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button 
              className="primary-button"
              type="submit"
              disabled={loading}
              >
              {loading ? "로그인 중!" : "로그인"}
            </button>
            <p
              className="sign-up"
              onClick={() => navigate("/signup")}
              >
              회원가입
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}