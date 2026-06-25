package com.example.iris.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PredictRequest {
    private Double sepalLength;
    private Double sepalWidth;
    private Double petalLength;
    private Double petalWidth;
}
