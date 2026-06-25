package com.example.iris.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FastApiPredictRequest {
    @JsonProperty("sepal_length")
    private Double sepalLength;

    @JsonProperty("sepal_width")
    private Double sepalWidth;

    @JsonProperty("petal_length")
    private Double petalLength;

    @JsonProperty("petal_width")
    private Double petalWidth;
}
