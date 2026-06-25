# --- [1단계: 빌드 환경 구성] ---
# 현재 도커 허브에서 가장 안정적이고 유지보수가 활발한 공식 자바 이미지인
# Eclipse Temurin JDK 21을 베이스 이미지로 사용합니다. (기존 openjdk 태그 누락 에러 해결)
FROM eclipse-temurin:21-jdk AS builder

WORKDIR /build
COPY . .

# gradlew 실행 권한 부여 (도커 내부 빌드 에러 방지)
RUN chmod +x ./gradlew

# Gradle Wrapper를 이용하여 bootJar 빌드 수행
RUN ./gradlew bootJar -x test

# --- [2단계: 실행 환경 구성] ---
# 동일하게 최적화된 Temurin JDK 21 런타임을 사용합니다.
FROM eclipse-temurin:21-jdk

WORKDIR /app

# 1단계 빌드 결과물에서 생성된 단일 실행 jar 파일만 복사
COPY --from=builder /build/build/libs/*-SNAPSHOT.jar ./app.jar

# 8080 포트 오픈
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]