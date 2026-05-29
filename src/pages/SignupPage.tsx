import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // 페이지 이동 함수

  // 회원가입 버튼을 눌렀을 때 실행되는 함수
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // 에러 초기화

    setLoading(true) // loading 상태
    try{
      // POST /api/auth/signup 으로 이름, 이메일, 비밀번호 전송
      // 회원가입은 응답으로 토큰이 아닌 성공 메시지만 받음
      await axios.post("/api/auth/signup", {email, password, name});
      console.log("회원가입 성공");

      // 회원가입 성공 시 로그인 페이지 이동
      navigate("/login");
    }catch(err: any){
      // 서버가 에러 응답을 보낸 경우
      const status = err.response?.status;

      if(status === 400){
        setError("이미 존재하는 이메일입니다.");
      }else{
        setError("서버 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);  // loading 해제 
    }
  };

  return (
    <div className="wrapper">
      <div className="card">
        <h1>SIGN UP</h1>
        {error && <p style={{color: "red"}}>{error}</p>}
        <form onSubmit={handleSignup}>
          <div className="input-style">
            <label>이메일</label>
            <input type="email" placeholder="email" value={email}
              onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="input-style">
            <label>비밀번호</label>
            <input type="password" placeholder="password" value={password}
              onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="input-style">
            <label>이름</label>
            <input type="text" placeholder="이름" value={name}
              onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="input-style">
            <label>닉네임</label>
            <input type="text" placeholder="닉네임" value={nickname}
              onChange={(e) => setNickname(e.target.value)} />
          </div>

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "가입 중!" : "회원가입"}
          </button>
        </form>
      </div>
    </div>
  );
}