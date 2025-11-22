import { managerTicketsByCategory } from '../mockData.js';

function ManagerTicketsPage() {
  return (
    <div>
      <h2 className='h4 mb-1'>Аналитика по тикетам</h2>
      <p className='text-muted small mb-3'>
        Распределение обращений по категориям и статусам помогает планировать
        нагрузку на операторов и развитие ИИ-ассистента.
      </p>

      <div className='card border-0 shadow-sm'>
        <div className='card-body'>
          <div className='table-responsive small'>
            <table className='table align-middle mb-0'>
              <thead>
                <tr>
                  <th>Категория</th>
                  <th>Всего тикетов</th>
                  <th>Открытые</th>
                  <th>Решены только ИИ</th>
                </tr>
              </thead>
              <tbody>
                {managerTicketsByCategory.map((row) => (
                  <tr key={row.category}>
                    <td>{row.category}</td>
                    <td>{row.total}</td>
                    <td>{row.open}</td>
                    <td>{row.aiResolved}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerTicketsPage;
