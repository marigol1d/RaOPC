import { managerUsers } from '../mockData.js';

function ManagerUsersPage() {
  return (
    <div>
      <h2 className='h4 mb-1'>Пользователи сервиса</h2>
      <p className='text-muted small mb-3'>
        Таблица отражает операторов, менеджеров и служебные учётные записи, с
        возможностью просмотра роли и статуса доступа.
      </p>

      <div className='card border-0 shadow-sm'>
        <div className='card-body'>
          <div className='table-responsive small'>
            <table className='table align-middle mb-0'>
              <thead>
                <tr>
                  <th>Имя</th>
                  <th>Электронная почта</th>
                  <th>Роль</th>
                  <th>Статус</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {managerUsers.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>
                      {u.status === 'Активен' && (
                        <span className='badge bg-success-subtle text-success'>
                          Активен
                        </span>
                      )}
                      {u.status === 'Заблокирован' && (
                        <span className='badge bg-danger-subtle text-danger'>
                          Заблокирован
                        </span>
                      )}
                    </td>
                    <td className='text-end'>
                      <button
                        className='btn btn-sm btn-outline-secondary'
                        type='button'
                      >
                        Настроить
                      </button>
                    </td>
                  </tr>
                ))}
                {managerUsers.length === 0 && (
                  <tr>
                    <td colSpan='5' className='text-center text-muted py-4'>
                      Пользователи не найдены.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerUsersPage;
