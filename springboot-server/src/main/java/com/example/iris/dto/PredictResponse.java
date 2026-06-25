package com.example.iris.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PredictResponse {
    private String prediction;
    private Map<String, Double> probability;

    @JsonProperty("class_index")
    private Integer classIndex;
}
