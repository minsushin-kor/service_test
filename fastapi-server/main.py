import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import tensorflow as tf
import joblib
import numpy as np
import warnings

# Scikit-learn 버전 불일치 경고 무시
warnings.filterwarnings("ignore", category=UserWarning)

app = FastAPI(title="Iris Scaled Deep Learning API", description="FastAPI server using Keras model, StandardScaler, and LabelEncoder")

# 모델 및 유틸리티 경로 설정 (로컬 및 Docker 환경 공용)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "iris_model.keras")
scaler_path = os.path.join(BASE_DIR, "iris_scaler.joblib")
le_path = os.path.join(BASE_DIR, "iris_le.joblib")

# 전역 객체 로드
try:
    if os.path.exists(model_path) and os.path.exists(scaler_path) and os.path.exists(le_path):
        model = tf.keras.models.load_model(model_path)
        scaler = joblib.load(scaler_path)
        le = joblib.load(le_path)
        print("Keras model, StandardScaler, and LabelEncoder loaded successfully.")
        print("Classes:", le.classes_)
    else:
        print("Warning: One or more model/scaler/encoder files are missing.")
        model, scaler, le = None, None, None
except Exception as e:
    print(f"Error loading models/utilities: {e}")
    model, scaler, le = None, None, None

# 입력 데이터 검증을 위한 Pydantic 모델
class IrisFeatures(BaseModel):
    sepal_length: float = Field(..., description="Sepal Length (cm)", example=5.1)
    sepal_width: float = Field(..., description="Sepal Width (cm)", example=3.5)
    petal_length: float = Field(..., description="Petal Length (cm)", example=1.4)
    petal_width: float = Field(..., description="Petal Width (cm)", example=0.2)

class PredictionResult(BaseModel):
    prediction: str
    probability: dict
    class_index: int

@app.get("/")
def read_root():
    return {"message": "Iris Scaled Deep Learning API is running. Use POST /predict."}

@app.post("/predict", response_model=PredictionResult)
def predict(features: IrisFeatures):
    if model is None or scaler is None or le is None:
        raise HTTPException(status_code=500, detail="Models or preprocessing utilities not loaded on server.")
    
    try:
        # 1. 입력 피처 2차원 배열 구성
        input_data = np.array([[
            features.sepal_length,
            features.sepal_width,
            features.petal_length,
            features.petal_width
        ]], dtype=np.float32)
        
        # 2. 스케일러 전처리 적용
        scaled_data = scaler.transform(input_data)
        
        # 3. Keras 모델 예측 수행 (확률 분포 출력)
        predictions = model.predict(scaled_data)
        probabilities = predictions[0]
        
        # 4. 예측 인덱스 계산 (argmax)
        prediction_idx = int(np.argmax(probabilities))
        
        # 5. LabelEncoder 및 클래스 맵을 사용해 결과명 맵핑
        prediction_name = str(le.classes_[prediction_idx])
        probability_map = {str(le.classes_[i]): float(prob) for i, prob in enumerate(probabilities)}
        
        return PredictionResult(
            prediction=prediction_name,
            probability=probability_map,
            class_index=prediction_idx
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
