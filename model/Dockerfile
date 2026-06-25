# 실행을 위한 Python 환경을 가져옵니다.
FROM python:3.13-slim

WORKDIR /code

# 패키지 목록을 복사하고 도커 내부에서 '알아서' 라이브러리를 설치합니다.
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# 소스 코드를 모두 복사합니다.
COPY ./ /code/

# FastAPI 서버를 실행합니다.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]