# --- [1단계: 실행 환경 설정] ---
# 가벼운 Python 3.11 slim 버전을 베이스 이미지로 사용합니다.
FROM python:3.13-slim

# 시스템 의존성 업데이트 및 빌드 필수 도구 설치 (h5py 등 C 확장 패키지 호환성용)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 컨테이너 내 작업 디렉토리 지정
WORKDIR /app

# 캐시 효율성을 위해 requirements.txt를 먼저 복사하고 패키지를 설치합니다.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 소스코드 및 학습 완료된 모델 파일들을 컨테이너 내부로 복사합니다.
COPY . .

# FastAPI의 기본 포트인 8000번 포트를 엽니다.
EXPOSE 8000

# uvicorn을 사용해 FastAPI 서버를 실행합니다.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
