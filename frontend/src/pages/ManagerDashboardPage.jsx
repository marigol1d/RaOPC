import { Link } from 'react-router-dom';
import { managerMetrics } from '../mockData.js';

function ManagerDashboardPage() {
  return (
    <div>
      <div className='mb-3'>
        <h2 className='h4 mb-1'>Панель менеджера сервиса</h2>
        <p className='text-muted small mb-0'>
          Выберите раздел для анализа метрик, управления тикетами, контроля
          качества или работы с пользователями.
        </p>
      </div>

      <div className='row g-3 mb-3'>
        <div className='col-12 col-md-3'>
          <div className='card border-0 shadow-sm h-100'>
            <div className='card-body'>
              <p className='text-muted small mb-1'>
                Среднее время первого ответа
              </p>
              <h5 className='mb-0'>{managerMetrics.avgFirstResponse}</h5>
            </div>
          </div>
        </div>
        <div className='col-12 col-md-3'>
          <div className='card border-0 shadow-sm h-100'>
            <div className='card-body'>
              <p className='text-muted small mb-1'>
                Тикеты, решённые только ИИ
              </p>
              <h5 className='mb-0'>{managerMetrics.aiResolutionShare}</h5>
            </div>
          </div>
        </div>
        <div className='col-12 col-md-3'>
          <div className='card border-0 shadow-sm h-100'>
            <div className='card-body'>
              <p className='text-muted small mb-1'>CSAT по сервису</p>
              <h5 className='mb-0'>{managerMetrics.csat}</h5>
            </div>
          </div>
        </div>
        <div className='col-12 col-md-3'>
          <div className='card border-0 shadow-sm h-100'>
            <div className='card-body'>
              <p className='text-muted small mb-1'>Открытые тикеты</p>
              <h5 className='mb-0'>{managerMetrics.openTickets}</h5>
            </div>
          </div>
        </div>
      </div>

      <div className='row g-3'>
        <div className='col-12 col-md-3'>
          <Link
            to='/manager/metrics'
            className='btn btn-light w-100 text-start ticket-card-btn'
          >
            <h6 className='mb-1'>Метрики</h6>
            <p className='small text-muted mb-0'>
              Детальный просмотр ключевых KPI тикет-сервиса и эффективности
              ИИ-ассистента.
            </p>
          </Link>
        </div>
        <div className='col-12 col-md-3'>
          <Link
            to='/manager/tickets'
            className='btn btn-light w-100 text-start ticket-card-btn'
          >
            <h6 className='mb-1'>Тикеты</h6>
            <p className='small text-muted mb-0'>
              Анализ распределения тикетов по категориям и статусам обработки.
            </p>
          </Link>
        </div>
        <div className='col-12 col-md-3'>
          <Link
            to='/manager/quality'
            className='btn btn-light w-100 text-start ticket-card-btn'
          >
            <h6 className='mb-1'>Контроль качества</h6>
            <p className='small text-muted mb-0'>
              Оценки пользователей, проблемные тикеты и фокус на улучшение
              сервиса.
            </p>
          </Link>
        </div>
        <div className='col-12 col-md-3'>
          <Link
            to='/manager/users'
            className='btn btn-light w-100 text-start ticket-card-btn'
          >
            <h6 className='mb-1'>Пользователи</h6>
            <p className='small text-muted mb-0'>
              Управление доступом операторов и служебных учётных записей.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboardPage;
