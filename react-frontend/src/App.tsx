import { useState } from 'react';
import { Flower2, Sliders, RefreshCw, BarChart3, HelpCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';

interface PredictionResponse {
  prediction: string;
  probability: {
    [key: string]: number;
  };
  class_index: number;
}

function App() {
  // Iris 피처 상태 관리 (기본값은 Iris 데이터셋의 평균치 근처로 세팅)
  const [sepalLength, setSepalLength] = useState<number>(5.8);
  const [sepalWidth, setSepalWidth] = useState<number>(3.0);
  const [petalLength, setPetalLength] = useState<number>(3.8);
  const [petalWidth, setPetalWidth] = useState<number>(1.2);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);

  // 예측 요청 API 호출
  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sepalLength,
          sepalWidth,
          petalLength,
          petalWidth,
        }),
      });

      if (!response.ok) {
        throw new Error('서버로부터 예측 결과를 가져오는데 실패했습니다.');
      }

      const data: PredictionResponse = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || '네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 피처 리셋 기능
  const handleReset = () => {
    setSepalLength(5.8);
    setSepalWidth(3.0);
    setPetalLength(3.8);
    setPetalWidth(1.2);
    setResult(null);
    setError(null);
  };

  // 차트 데이터 변환
  const getChartData = () => {
    if (!result) return [];
    return Object.entries(result.probability).map(([name, val]) => ({
      name: name.toUpperCase(),
      probability: Math.round(val * 100),
    }));
  };

  const chartData = getChartData();

  // 각 붓꽃 종류에 따른 이미지/디자인 메타데이터
  const getSpeciesInfo = (species: string) => {
    switch (species.toLowerCase()) {
      case 'setosa':
        return {
          color: '#10b981',
          badgeClass: 'badge-setosa',
          bgGradient: 'from-emerald-500/10 to-teal-500/5',
          description: 'Setosa(세토사)는 꽃잎이 매우 작고 청초한 보랏빛을 띠는 붓꽃입니다. 주로 습지 근처에서 자랍니다.',
        };
      case 'versicolor':
        return {
          color: '#f59e0b',
          badgeClass: 'badge-versicolor',
          bgGradient: 'from-amber-500/10 to-orange-500/5',
          description: 'Versicolor(버시칼라)는 다채로운 푸른 보라색 꽃을 피우며, 크기와 형태가 평균적인 균형을 이룹니다.',
        };
      case 'virginica':
        return {
          color: '#6366f1',
          badgeClass: 'badge-virginica',
          bgGradient: 'from-indigo-500/10 to-purple-500/5',
          description: 'Virginica(버진아카)는 꽃의 크기가 가장 크고 꽃잎의 무늬가 짙고 화려한 특징을 가집니다.',
        };
      default:
        return {
          color: '#3b82f6',
          badgeClass: 'badge-primary',
          bgGradient: 'from-blue-500/10 to-cyan-500/5',
          description: '알 수 없는 품종입니다.',
        };
    }
  };

  const speciesInfo = result ? getSpeciesInfo(result.prediction) : null;

  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.5rem' }}>
          <Flower2 size={40} color="#00f2fe" style={{ filter: 'drop-shadow(0 0 8px rgba(0, 242, 254, 0.5))' }} />
          <h1>Iris Species Predictor</h1>
        </div>
        <p className="subtitle">
          {/*꽃잎(Petal)과 꽃받침(Sepal)의 측정 데이터를 바탕으로 붓꽃의 품종을 실시간 예측합니다.*/}
          이거 바뀐거야.
        </p>
      </header>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        
        {/* Left Side: Input Controls */}
        <section className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.8rem' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 600 }}>
              <Sliders size={20} color="#4facfe" /> 피처 수치 입력
            </h3>
            <button 
              onClick={handleReset}
              style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem' }}
            >
              <RefreshCw size={14} /> 초기화
            </button>
          </div>

          {/* Sepal Length */}
          <div className="input-group">
            <div className="input-label">
              <span>꽃받침 길이 (Sepal Length)</span>
              <span className="input-value">{sepalLength.toFixed(1)} cm</span>
            </div>
            <input 
              type="range" 
              min={4.3} 
              max={7.9} 
              step={0.1} 
              value={sepalLength} 
              onChange={(e) => setSepalLength(parseFloat(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#475569', marginTop: '0.2rem' }}>
              <span>Min: 4.3</span>
              <span>Max: 7.9</span>
            </div>
          </div>

          {/* Sepal Width */}
          <div className="input-group">
            <div className="input-label">
              <span>꽃받침 너비 (Sepal Width)</span>
              <span className="input-value">{sepalWidth.toFixed(1)} cm</span>
            </div>
            <input 
              type="range" 
              min={2.0} 
              max={4.4} 
              step={0.1} 
              value={sepalWidth} 
              onChange={(e) => setSepalWidth(parseFloat(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#475569', marginTop: '0.2rem' }}>
              <span>Min: 2.0</span>
              <span>Max: 4.4</span>
            </div>
          </div>

          {/* Petal Length */}
          <div className="input-group">
            <div className="input-label">
              <span>꽃잎 길이 (Petal Length)</span>
              <span className="input-value">{petalLength.toFixed(1)} cm</span>
            </div>
            <input 
              type="range" 
              min={1.0} 
              max={6.9} 
              step={0.1} 
              value={petalLength} 
              onChange={(e) => setPetalLength(parseFloat(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#475569', marginTop: '0.2rem' }}>
              <span>Min: 1.0</span>
              <span>Max: 6.9</span>
            </div>
          </div>

          {/* Petal Width */}
          <div className="input-group" style={{ marginBottom: '2.5rem' }}>
            <div className="input-label">
              <span>꽃잎 너비 (Petal Width)</span>
              <span className="input-value">{petalWidth.toFixed(1)} cm</span>
            </div>
            <input 
              type="range" 
              min={0.1} 
              max={2.5} 
              step={0.1} 
              value={petalWidth} 
              onChange={(e) => setPetalWidth(parseFloat(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#475569', marginTop: '0.2rem' }}>
              <span>Min: 0.1</span>
              <span>Max: 2.5</span>
            </div>
          </div>

          <button 
            className="btn-predict" 
            onClick={handlePredict} 
            disabled={loading}
          >
            {loading ? (
              <>
                <RefreshCw className="animate-spin" size={20} />
                예측 분석 중...
              </>
            ) : (
              '품종 예측하기'
            )}
          </button>
        </section>

        {/* Right Side: Prediction Result */}
        <section className="glass-panel" style={{ overflow: 'hidden' }}>
          {!result && !error && !loading && (
            <div className="result-card">
              <HelpCircle size={48} color="#475569" style={{ marginBottom: '1rem' }} />
              <h3 style={{ margin: 0, color: '#94a3b8', fontSize: '1.2rem', marginBottom: '0.5rem' }}>예측 대기 중</h3>
              <p style={{ margin: 0, color: '#475569', fontSize: '0.9rem', textAlign: 'center', maxWidth: '280px' }}>
                왼쪽 패널에서 붓꽃의 수치를 조정한 후 '품종 예측하기' 버튼을 클릭해 주세요.
              </p>
            </div>
          )}

          {loading && (
            <div className="result-card">
              <RefreshCw size={40} className="animate-spin" color="#00f2fe" style={{ marginBottom: '1rem' }} />
              <h3 style={{ margin: 0, color: '#94a3b8', fontSize: '1.1rem' }}>분석 모델 구동 중...</h3>
            </div>
          )}

          {error && (
            <div className="result-card" style={{ color: '#ef4444' }}>
              <HelpCircle size={40} style={{ marginBottom: '1rem' }} />
              <h3 style={{ margin: 0, fontSize: '1.1rem', marginBottom: '0.5rem' }}>오류 발생</h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#f87171', textAlign: 'center' }}>{error}</p>
            </div>
          )}

          {result && !loading && speciesInfo && (
            <div className={`result-card bg-gradient-to-br ${speciesInfo.bgGradient}`}>
              <span className={`badge ${speciesInfo.badgeClass}`}>
                Prediction Result
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Flower2 size={32} color={speciesInfo.color} />
                <h2 className="prediction-title" style={{ color: speciesInfo.color, margin: 0 }}>
                  Iris {result.prediction}
                </h2>
              </div>
              <p style={{ fontSize: '0.95rem', color: '#94a3b8', textAlign: 'center', lineHeight: 1.6, maxWidth: '340px', margin: '0 auto 1.5rem auto' }}>
                {speciesInfo.description}
              </p>

              {/* Probability Chart */}
              <div style={{ width: '100%', height: '180px', marginTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.8rem', fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>
                  <BarChart3 size={16} /> 분류 확률 상세 정보
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis dataKey="name" type="category" stroke="#475569" fontSize={11} width={80} tickLine={false} axisLine={false} />
                    <Tooltip 
                      formatter={(value: any) => [`${value}%`, '확률']}
                      contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    />
                    <Bar dataKey="probability" radius={[0, 4, 4, 0]} barSize={12}>
                      {chartData.map((entry, index) => {
                        const nameLower = entry.name.toLowerCase();
                        let barColor = '#3b82f6';
                        if (nameLower === 'setosa') barColor = '#10b981';
                        if (nameLower === 'versicolor') barColor = '#f59e0b';
                        if (nameLower === 'virginica') barColor = '#6366f1';
                        return <Cell key={`cell-${index}`} fill={barColor} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </section>

      </div>

      {/* Footer */}
      <footer style={{ marginTop: '4rem', textAlign: 'center', color: '#334155', fontSize: '0.85rem' }}>
        <p>Iris Species Web Predictor - Built with React & Spring Boot & FastAPI</p>
      </footer>
    </div>
  );
}

export default App;
