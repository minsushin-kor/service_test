import joblib
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
import os

def train_and_save_model():
    # 1. 데이터셋 로드
    iris = load_iris()
    X = iris.data
    y = iris.target
    
    # 2. 데이터 분할 (학습용, 테스트용)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # 3. 데이터 정규화 (StandardScaler)
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # 4. 모델 학습 (Random Forest Classifier)
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)
    
    # 평가 출력
    accuracy = model.score(X_test_scaled, y_test)
    print(f"Model Accuracy: {accuracy * 100:.2f}%")
    
    # 5. 저장 디렉토리 생성 및 모델/스케일러 저장
    os.makedirs('d:/minsu/workspace_boot/workspace_python/python_model/model', exist_ok=True)
    
    model_path = 'd:/minsu/workspace_boot/workspace_python/python_model/model/iris_model.pkl'
    scaler_path = 'd:/minsu/workspace_boot/workspace_python/python_model/model/scaler.pkl'
    
    joblib.dump(model, model_path)
    joblib.dump(scaler, scaler_path)
    
    print(f"Model saved to {model_path}")
    print(f"Scaler saved to {scaler_path}")
    print("Iris Target Names:", iris.target_names) # ['setosa' 'versicolor' 'virginica']

if __name__ == '__main__':
    train_and_save_model()
