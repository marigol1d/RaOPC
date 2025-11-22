import { Link } from 'react-router-dom';
import { initiatorTickets } from '../mockData.js';
import TicketStatusBadge from '../components/TicketStatusBadge.jsx';

function InitiatorTicketsPage() {
  return (
    <div>
      <div className='d-flex justify-content-between align-items-center mb-3'>
        <div>
          <h2 className='h4 mb-1'>Мои тикеты</h2>
          <p className='text-muted small mb-0'>
            Здесь отображаются все обращения, созданные под вашей учётной
            записью.
          </p>
        </div>
        <Link to='/initiator/tickets/new' className='btn btn-primary'>
          Создать тикет
        </Link>
      </div>

      <div className='row g-3'>
        {initiatorTickets.map((ticket) => (
          <div className='col-12 col-md-6' key={ticket.id}>
            <Link
              to={`/initiator/tickets/${ticket.id}`}
              className='btn btn-light w-100 text-start ticket-card-btn'
            >
              <div className='d-flex justify-content-between mb-1'>
                <span className='fw-semibold'>{ticket.subject}</span>
                <TicketStatusBadge status={ticket.status} />
              </div>
              <div className='small text-muted mb-1'>
                № {ticket.id} · {ticket.category}
              </div>
              <div className='d-flex justify-content-between align-items-center small'>
                <span>Обновлён: {ticket.lastUpdate}</span>
                {ticket.priority === 'high' && (
                  <span className='badge badge-priority-high'>
                    Высокий приоритет
                  </span>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InitiatorTicketsPage;
