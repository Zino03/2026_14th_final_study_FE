import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [emailChecked, setEmailChecked] = useState(false); // 중복 확인 통과 여부
  const [emailMsg, setEmailMsg] = useState(""); // 확인 결과 메시지

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // 페이지 이동 함수

  const handleCheckEmail = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 이메일 입력 확인
    if (!email) {
      setEmailMsg("이메일을 입력해주세요.");
      return;
    }

    // 이메일 형식 체크
    if (!emailRegex.test(email)) {
      setEmailMsg("올바른 이메일 형식이 아닙니다.");
      return;
    }
    try {
      // 백엔드에 email check 요청
      await axios.get(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
      setEmailChecked(true);
      setEmailMsg("사용 가능한 이메일입니다.");
    } catch(err: any) {
      setEmailChecked(false);
      const status = err.response?.status;
      if (status === 409) {
        setEmailMsg("이미 사용 중인 이메일입니다.");
      } else {
        setEmailMsg("확인 중 오류가 발생했습니다.");
      }
    }
  };


  // 회원가입 버튼을 눌렀을 때 실행되는 함수
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // 에러 초기화

    // 필수값 누락 체크
    if (!email || !password || !confirmPassword || !name || !nickname) {
      setError("모든 항목을 입력해주세요.");
      return;
    }

    // 이메일 형식 확인
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("올바른 이메일 형식이 아닙니다.");
      return;
    }

    // 중복 확인 여부 체크
    if (!emailChecked) {
      setError("이메일 중복 확인을 해주세요.");
      return;
    }

    // 비밀번호 최소 길이 + 영문, 숫자 포함
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("비밀번호는 영문, 숫자를 포함한 8자 이상이어야 합니다.");
      return;
    }

    // 비밀번호 확인 일치
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true) // loading 상태
    try{
      // POST /api/auth/signup 으로 이름, 이메일, 비밀번호 전송
      // 회원가입은 응답으로 토큰이 아닌 성공 메시지만 받음
      await axios.post("/api/auth/signup", {email, password, name, nickname});

      // 회원가입 성공 시 로그인 페이지 이동
      navigate("/login");
    }catch(err: any){
      // 서버가 에러 응답을 보낸 경우
      const status = err.response?.status;

      if(status === 400){
        setError("입력값을 확인해주세요.");
      }else if(status === 409){
        setError("이미 존재하는 이메일 또는 닉네임입니다.");
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
            <div className="email-check">
              <input type="email" placeholder="email" value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setEmailChecked(false);
                  setEmailMsg("");
                }} />
              <button type="button" className="check-button" onClick={handleCheckEmail}>
                중복 확인
              </button>
            </div>
            {emailMsg && (
              <p style={{ fontSize: "12px", color: emailChecked ? "green" : "red" }}>
                {emailMsg}
              </p>
            )}
          </div>

          <div className="input-style">
            <label>비밀번호</label>
            <input type="password" placeholder="password" value={password}
              onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="input-style">
            <label>비밀번호 확인</label>
            <input type="password" placeholder="비밀번호 확인" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} />
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