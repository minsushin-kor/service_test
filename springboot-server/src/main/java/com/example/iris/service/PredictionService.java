package com.example.iris.service;

import com.example.iris.dto.FastApiPredictRequest;
import com.example.iris.dto.PredictRequest;
import com.example.iris.dto.PredictResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class PredictionService {

    private final WebClient webClient;

    public PredictionService(@Value("${fastapi.url}") String fastApiUrl) {
        this.webClient = WebClient.builder()
                .baseUrl(fastApiUrl)
                .build();
    }

    public Mono<PredictResponse> predictIris(PredictRequest request) {
        // React 요청 DTO -> FastAPI 요청 DTO 변환
        FastApiPredictRequest apiRequest = FastApiPredictRequest.builder()
                .sepalLength(request.getSepalLength())
                .sepalWidth(request.getSepalWidth())
                .petalLength(request.getPetalLength())
                .petalWidth(request.getPetalWidth())
                .build();

        // FastAPI 서버로 비동기 POST 요청 송신 및 결과 파싱
        return this.webClient.post()
                .uri("/predict")
                .bodyValue(apiRequest)
                .retrieve()
                .bodyToMono(PredictResponse.class);
    }
}
