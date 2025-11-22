import { Link } from 'react-router-dom';
import { agentQueue } from '../mockData.js';

function AgentInboxPage() {
  return (
    <div>
      <div className='mb-3'>
        <h2 className='h4 mb-1'>Очередь тикетов оператора</h2>
        <p className='text-muted small mb-0'>
          Здесь отображаются обращения, по которым требуется участие оператора
          после ответа ИИ-ассистента.
        </p>
      </div>

      <div className='card border-0 shadow-sm'>
        <div className='card-body'>
          <div className='d-flex justify-content-between align-items-center mb-2'>
            <span className='small text-muted'>
              Всего тикетов: {agentQueue.length}
            </span>
            <div className='d-flex gap-2 small'>
              <span className='badge bg-light text-muted'>
                Высокий приоритет:{' '}
                {agentQueue.filter((t) => t.priority === 'high').length}
              </span>
              <span className='badge bg-light text-muted'>
                Непрочитанные: {agentQueue.filter((t) => t.unread).length}
              </span>
            </div>
          </div>

          <div className='table-responsive small'>
            <table className='table align-middle mb-0'>
              <thead>
                <tr>
                  <th>№ тикета</th>
                  <th>Тема</th>
                  <th>Источник</th>
                  <th>Статус</th>
                  <th>Категория</th>
                  <th>Приоритет</th>
                  <th>SLA</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {agentQueue.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className={ticket.unread ? 'fw-semibold' : ''}
                  >
                    <td>{ticket.id}</td>
                    <td>{ticket.subject}</td>
                    <td>
                      {ticket.source === 'ai_failed' && 'ИИ не помог'}
                      {ticket.source === 'ai_escalation' && 'Эскалация ИИ'}
                      {ticket.source === 'direct' && 'Напрямую'}
                    </td>
                    <td>
                      {ticket.status === 'waiting_operator' &&
                        'Ожидает анализа'}
                      {ticket.status === 'in_progress' && 'В работе'}
                      {ticket.status === 'queued' && 'В очереди'}
                    </td>
                    <td>{ticket.category}</td>
                    <td>
                      {ticket.priority === 'high' && (
                        <span className='badge badge-priority-high'>
                          Высокий
                        </span>
                      )}
                      {ticket.priority === 'normal' && 'Обычный'}
                      {ticket.priority === 'low' && 'Низкий'}
                    </td>
                    <td>{ticket.sla}</td>
                    <td className='text-end'>
                      <Link
                        to={`/agent/tickets/${ticket.id}`}
                        className='btn btn-sm btn-outline-primary'
                      >
                        В работу
                      </Link>
                    </td>
                  </tr>
                ))}
                {agentQueue.length === 0 && (
                  <tr>
                    <td colSpan='8' className='text-center text-muted py-4'>
                      Очередь тикетов пуста.
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

export default AgentInboxPage;
