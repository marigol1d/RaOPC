import { managerRecentRatings } from '../mockData.js';

function ManagerQualityPage() {
  return (
    <div>
      <h2 className='h4 mb-1'>Контроль качества обслуживания</h2>
      <p className='text-muted small mb-3'>
        Здесь отображаются последние оценки пользователей по закрытым тикетам и
        комментарии, требующие внимания менеджера.
      </p>

      <div className='card border-0 shadow-sm'>
        <div className='card-body'>
          <ul className='list-group list-group-flush'>
            {managerRecentRatings.map((r) => (
              <li key={r.id} className='list-group-item px-0'>
                <div className='d-flex justify-content-between'>
                  <div>
                    <div className='small text-muted mb-1'>Тикет {r.id}</div>
                    <div className='small'>{r.comment}</div>
                  </div>
                  <div className='text-nowrap'>
                    <span className='badge bg-light text-dark'>
                      Оценка: {r.score} / 5
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ManagerQualityPage;
