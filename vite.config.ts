import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    // /api로 시작하는 요청을 4000번 서버로 전달
    proxy: {
      '/api': "http://localhost:4000"
    }
  }
})

/* proxy를 설정하는 이유!
프론트, 백의 포트가 다름
-> 포트가 다르면 브라우저가 다른 Origin으로 인식해서 CORS 에러
proxy를 설정해서 브라우저 입장에서 같은 주소로 요청하는 것처럼 보이도록 함
*/
