# --- [1단계: 빌드 환경 구성] ---
# 안정적인 최신 Node.js LTS 버전(20)을 가져옵니다.
FROM node:20-alpine AS builder

WORKDIR /app

# 의존성 패키지 캐싱을 위해 package.json 파일들만 먼저 복사 후 설치
COPY package.json package-lock.json ./
RUN npm ci --silent

# 소스코드 전체를 복사하여 빌드 실행
COPY . .
RUN npm run build

# --- [2단계: 실 서버 실행 환경 구성] ---
# 빌드 완료된 정적 리소스를 제공할 가벼운 Nginx 서버를 가져옵니다.
FROM nginx:alpine

# 작성한 Nginx 프록시 설정 파일을 도커 내부로 복사하여 기본 설정을 덮어씁니다.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Vite 빌드 결과 폴더는 'build'가 아니라 'dist'입니다.
# 빌드된 정적 리소스를 Nginx 기본 웹 서빙 경로로 복사합니다.
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx 포트 설정 (80번)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]