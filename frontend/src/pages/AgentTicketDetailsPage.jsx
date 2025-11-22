import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { agentQueue, ticketThreads } from '../mockData.js';

function AgentTicketDetailsPage() {
  const { id } = useParams();
  const ticket = agentQueue.find((t) => t.id === id);
  const thread = ticketThreads[id] || [];

  const [stage, setStage] = useState('analysis');
  const [resolutionText, setResolutionText] = useState('');
  const [clarificationText, setClarificationText] = useState('');

  if (!ticket) {
    return (
      <div>
        <p>Тикет не найден в очереди оператора.</p>
        <Link to='/agent/inbox' className='btn btn-outline-primary'>
          Вернуться к очереди
        </Link>
      </div>
    );
  }

  function handleSendResolution(e) {
    e.preventDefault();
    if (!resolutionText.trim()) return;
    setStage('resolved');
  }

  function handleAskClarification(e) {
    e.preventDefault();
    if (!clarificationText.trim()) return;
    setStage('waiting_reply');
  }

  return (
    <div className='row g-4'>
      <div className='col-lg-7'>
        <div className='mb-2'>
          <h2 className='h4 mb-1'>{ticket.subject}</h2>
          <div className='small text-muted'>
            № {ticket.id} · Категория: {ticket.category}
          </div>
        </div>

        <div className='card border-0 shadow-sm mb-3'>
          <div className='card-header bg-white border-0 pb-0'>
            <h6 className='mb-1'>Диалог по тикету</h6>
            <p className='small text-muted mb-0'>
              История переписки инициатора с ИИ-ассистентом и оператором.
            </p>
          </div>
          <div className='card-body message-thread'>
            {thread.map((msg) => (
              <div
                key={msg.id}
                className={
                  'message-bubble ' +
                  (msg.from === 'ai'
                    ? 'message-bubble-ai'
                    : 'message-bubble-user')
                }
              >
                <div className='message-meta mb-1'>
                  {msg.author} · {msg.ts}
                </div>
                <div>{msg.text}</div>
              </div>
            ))}

            {stage === 'waiting_reply' && (
              <div className='message-bubble message-bubble-ai'>
                <div className='message-meta mb-1'>
                  Вы как оператор · сейчас
                </div>
                <div>
                  Отправлен запрос уточнения инициатору. После ответа необходимо
                  обновить решение.
                </div>
              </div>
            )}

            {stage === 'resolved' && (
              <div className='message-bubble message-bubble-ai'>
                <div className='message-meta mb-1'>
                  Вы как оператор · сейчас
                </div>
                <div>
                  Решение отправлено инициатору. После его оценки тикет будет
                  закрыт автоматически.
                </div>
              </div>
            )}
          </div>
        </div>

        {stage === 'analysis' && (
          <form
            className='card border-0 shadow-sm mb-3'
            onSubmit={handleSendResolution}
          >
            <div className='card-body'>
              <h6 className='mb-2'>Решение тикета</h6>
              <p className='small text-muted'>
                На основе ответа ИИ и вашего анализа сформулируйте понятное
                решение для инициатора.
              </p>
              <textarea
                className='form-control mb-2'
                rows='4'
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
                placeholder='Опишите шаги, которые нужно выполнить пользователю, или применённые вами действия.'
              />
              <div className='d-flex flex-wrap gap-2'>
                <button type='submit' className='btn btn-primary'>
                  Отправить решение тикета
                </button>
                <button
                  type='button'
                  className='btn btn-outline-secondary'
                  onClick={() => setStage('clarification')}
                >
                  Нужны уточнения от инициатора
                </button>
              </div>
            </div>
          </form>
        )}

        {stage === 'clarification' && (
          <form
            className='card border-0 shadow-sm mb-3'
            onSubmit={handleAskClarification}
          >
            <div className='card-body'>
              <h6 className='mb-2'>Запрос уточнения</h6>
              <p className='small text-muted'>
                Сформулируйте конкретные вопросы, которые помогут понять
                ситуацию.
              </p>
              <textarea
                className='form-control mb-2'
                rows='3'
                value={clarificationText}
                onChange={(e) => setClarificationText(e.target.value)}
                placeholder='Например: воспроизведите ошибку и приложите скриншот, укажите браузер и версию операционной системы.'
              />
              <div className='d-flex flex-wrap gap-2'>
                <button type='submit' className='btn btn-primary'>
                  Отправить запрос инициатору
                </button>
                <button
                  type='button'
                  className='btn btn-outline-secondary'
                  onClick={() => setStage('analysis')}
                >
                  Вернуться к формулировке решения
                </button>
              </div>
            </div>
          </form>
        )}

        {stage === 'resolved' && (
          <div className='alert alert-success small'>
            Решение отправлено. После того как инициатор подтвердит, что
            проблема решена, тикет будет помечен как закрытый и попадёт в отчёт
            по качеству.
          </div>
        )}

        <Link to='/agent/inbox' className='btn btn-link mt-2 px-0'>
          ← Назад к очереди тикетов
        </Link>
      </div>

      <div className='col-lg-5'>
        <div className='card border-0 shadow-sm mb-3'>
          <div className='card-body'>
            <h6 className='mb-2'>Рекомендация ИИ-ассистента</h6>
            <p className='small mb-0'>
              Используйте ответ ИИ как базу для решения, но обязательно
              проверьте корректность и актуальность рекомендаций.
            </p>
          </div>
        </div>

        <div className='card border-0 shadow-sm'>
          <div className='card-body'>
            <h6 className='mb-2'>Шаги по user-flow оператора</h6>
            <ol className='small mb-0 ps-3'>
              <li>Получить тикет для работы из очереди.</li>
              <li>Изучить вопрос и ответ ИИ-ассистента.</li>
              <li>При необходимости запросить уточнения у инициатора.</li>
              <li>Сформулировать и отправить итоговое решение.</li>
              <li>Дождаться закрытия тикета и перейти к следующему.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentTicketDetailsPage;
