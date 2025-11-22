import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { initiatorTickets, ticketThreads } from '../mockData.js';
import TicketStatusBadge from '../components/TicketStatusBadge.jsx';

function InitiatorTicketDetailsPage() {
  const { id } = useParams();
  const baseTicket = initiatorTickets.find((t) => t.id === id);

  const [status, setStatus] = useState(baseTicket?.status || 'open');
  const [stage, setStage] = useState(
    baseTicket?.status === 'closed' ? 'rated' : 'ai_answer'
  );
  const [rating, setRating] = useState(0);

  if (!baseTicket) {
    return (
      <div>
        <p>Тикет не найден.</p>
        <Link to='/initiator/tickets' className='btn btn-outline-primary'>
          Вернуться к списку тикетов
        </Link>
      </div>
    );
  }

  const thread = ticketThreads[id] || [];

  function handleAiSolved() {
    setStatus('closed');
    setStage('rate');
  }

  function handleAiNotSolved() {
    setStatus('waiting_operator');
    setStage('waiting_operator');
  }

  function handleOperatorSolved() {
    setStatus('closed');
    setStage('rate');
  }

  function handleNeedClarification() {
    setStage('clarification');
  }

  function handleRate(value) {
    setRating(value);
    setStage('rated');
  }

  return (
    <div className='row g-4'>
      <div className='col-lg-7'>
        <div className='d-flex justify-content-between align-items-center mb-2'>
          <div>
            <h2 className='h4 mb-1'>{baseTicket.subject}</h2>
            <div className='small text-muted'>
              № {baseTicket.id} · Категория: {baseTicket.category}
            </div>
          </div>
          <TicketStatusBadge status={status} />
        </div>

        <div className='card border-0 shadow-sm mb-3'>
          <div className='card-header bg-white border-0 pb-0'>
            <h6 className='mb-1'>Диалог по тикету</h6>
            <p className='small text-muted mb-0'>
              Сначала отвечает ИИ-ассистент, при необходимости подключается
              оператор.
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

            {stage === 'waiting_operator' && (
              <div className='message-bubble message-bubble-ai'>
                <div className='message-meta mb-1'>Система · сейчас</div>
                Запрос передан оператору службы поддержки. Как только появится
                ответ, мы уведомим вас по почте и в интерфейсе тикетов.
              </div>
            )}

            {stage === 'clarification' && (
              <div className='message-bubble message-bubble-user'>
                <div className='message-meta mb-1'>Вы · сейчас</div>
                Нужны дополнительные уточнения по предложенному решению.
                Оператор свяжется со мной для прояснения деталей.
              </div>
            )}
          </div>
        </div>

        {stage === 'ai_answer' && (
          <div className='card border-0 shadow-sm mb-3'>
            <div className='card-body'>
              <h6 className='mb-2'>Помогло ли решение ИИ-ассистента?</h6>
              <p className='small text-muted'>
                Если подсказка закрывает проблему, тикет будет помечен как
                решённый, после чего можно оценить качество обслуживания.
              </p>
              <div className='d-flex flex-wrap gap-2'>
                <button
                  type='button'
                  className='btn btn-primary'
                  onClick={handleAiSolved}
                >
                  Да, проблема решена
                </button>
                <button
                  type='button'
                  className='btn btn-outline-secondary'
                  onClick={handleAiNotSolved}
                >
                  Нет, нужна помощь оператора
                </button>
              </div>
            </div>
          </div>
        )}

        {stage === 'operator_answer' && (
          <div className='card border-0 shadow-sm mb-3'>
            <div className='card-body'>
              <h6 className='mb-2'>Оператор прислал решение проблемы</h6>
              <p className='small mb-3'>
                Ознакомьтесь с ответом оператора и отметьте, удалось ли
                окончательно решить проблему.
              </p>
              <div className='d-flex flex-wrap gap-2'>
                <button
                  type='button'
                  className='btn btn-primary'
                  onClick={handleOperatorSolved}
                >
                  Решение подходит
                </button>
                <button
                  type='button'
                  className='btn btn-outline-secondary'
                  onClick={handleNeedClarification}
                >
                  Нужны уточнения
                </button>
              </div>
            </div>
          </div>
        )}

        {stage === 'waiting_operator' && (
          <div className='card border-0 shadow-sm mb-3'>
            <div className='card-body'>
              <h6 className='mb-2'>Запрос помощи оператора отправлен</h6>
              <p className='small mb-0'>
                Оператор увидит ваш тикет в своей очереди и ответит после
                анализа ситуации. Статус можно отслеживать в списке «Мои
                тикеты».
              </p>
            </div>
          </div>
        )}

        {stage === 'rate' && (
          <div className='card border-0 shadow-sm mb-3'>
            <div className='card-body'>
              <h6 className='mb-2'>Оцените качество обслуживания</h6>
              <p className='small text-muted mb-2'>
                Ваша оценка помогает улучшать ИИ-ассистента и качество работы
                операторов.
              </p>
              <div className='d-flex align-items-center gap-2 mb-2'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type='button'
                    className={
                      'btn btn-sm ' +
                      (rating >= star ? 'btn-primary' : 'btn-outline-secondary')
                    }
                    onClick={() => handleRate(star)}
                  >
                    {star}
                  </button>
                ))}
              </div>
              <p className='small mb-0'>
                Нажмите на число от 1 до 5, где 5 – всё отлично, 1 – сервис не
                помог.
              </p>
            </div>
          </div>
        )}

        {stage === 'rated' && (
          <div className='alert alert-success small'>
            Спасибо, ваша оценка {rating} сохранена. Тикет помечен как закрытый.
          </div>
        )}

        <Link to='/initiator/tickets' className='btn btn-link mt-2 px-0'>
          ← Назад к списку тикетов
        </Link>
      </div>

      <div className='col-lg-5'>
        <div className='card border-0 shadow-sm mb-3'>
          <div className='card-body'>
            <h6 className='mb-2'>Резюме от ИИ-ассистента</h6>
            <p className='small mb-0'>{baseTicket.aiSummary}</p>
          </div>
        </div>

        <div className='card border-0 shadow-sm'>
          <div className='card-body'>
            <h6 className='mb-2'>Краткий статус обработки</h6>
            <ul className='small mb-0'>
              <li>Тикет создан инициатором и зарегистрирован в системе.</li>
              <li>ИИ-ассистент сформировал первичный ответ.</li>
              <li>
                При необходимости тикет передаётся оператору поддержки, после
                чего вы оцениваете качество обслуживания.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InitiatorTicketDetailsPage;
