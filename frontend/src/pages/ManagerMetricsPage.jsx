import { managerMetrics } from '../mockData.js';

function ManagerMetricsPage() {
  return (
    <div>
      <h2 className='h4 mb-1'>Метрики тикет-сервиса</h2>
      <p className='text-muted small mb-3'>
        Раздел отражает ключевые показатели эффективности работы ИИ-ассистента и
        операторов.
      </p>

      <div className='row g-3 mb-3'>
        <div className='col-12 col-md-4'>
          <div className='card border-0 shadow-sm h-100'>
            <div className='card-body'>
              <p className='text-muted small mb-1'>
                Среднее время первого ответа
              </p>
              <h4 className='mb-0'>{managerMetrics.avgFirstResponse}</h4>
            </div>
          </div>
        </div>
        <div className='col-12 col-md-4'>
          <div className='card border-0 shadow-sm h-100'>
            <div className='card-body'>
              <p className='text-muted small mb-1'>
                Доля тикетов, решённых только ИИ
              </p>
              <h4 className='mb-0'>{managerMetrics.aiResolutionShare}</h4>
            </div>
          </div>
        </div>
        <div className='col-12 col-md-4'>
          <div className='card border-0 shadow-sm h-100'>
            <div className='card-body'>
              <p className='text-muted small mb-1'>
                Средний CSAT по обращениям
              </p>
              <h4 className='mb-0'>{managerMetrics.csat}</h4>
            </div>
          </div>
        </div>
      </div>

      <button className='btn btn-primary'>Скачать отчёт в формате PDF</button>
    </div>
  );
}

export default ManagerMetricsPage;
