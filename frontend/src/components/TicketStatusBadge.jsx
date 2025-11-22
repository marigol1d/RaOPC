function TicketStatusBadge({ status }) {
  if (status === 'ai_answered') {
    return <span className='badge badge-status-ai'>Ответ ИИ-ассистента</span>;
  }
  if (status === 'in_progress') {
    return <span className='badge badge-status-open'>В работе оператора</span>;
  }
  if (status === 'waiting_operator') {
    return (
      <span className='badge badge-status-waiting'>Ожидает оператора</span>
    );
  }
  if (status === 'closed') {
    return <span className='badge badge-status-closed'>Закрыт</span>;
  }
  return <span className='badge badge-status-open'>Открыт</span>;
}

export default TicketStatusBadge;
