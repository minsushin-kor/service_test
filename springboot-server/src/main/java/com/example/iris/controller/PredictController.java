package com.example.iris.controller;

import com.example.iris.dto.PredictRequest;
import com.example.iris.dto.PredictResponse;
import com.example.iris.service.PredictionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // 개발 편의를 위해 모든 오리진 허용 (React 포트와 통신용)
public class PredictController {

    private final PredictionService predictionService;

    @PostMapping("/predict")
    public Mono<PredictResponse> predict(@RequestBody PredictRequest request) {
        return predictionService.predictIris(request);
    }
}
