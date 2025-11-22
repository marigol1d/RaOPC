import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function InitiatorCreateTicketPage() {
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Отчёты');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('normal');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    if (!subject.trim() || !description.trim()) {
      setError('Заполните тему и описание тикета.');
      return;
    }

    navigate('/initiator/tickets');
  }

  return (
    <div className='row g-4'>
      <div className='col-lg-7'>
        <h2 className='h4 mb-1'>Создание тикета</h2>
        <p className='text-muted small mb-3'>
          Заполните необходимые данные о тикете – система автоматически передаст
          их ИИ-ассистенту и оператору поддержки.
        </p>

        <form className='card border-0 shadow-sm' onSubmit={handleSubmit}>
          <div className='card-body'>
            {error && (
              <div className='alert alert-danger py-2 small mb-3'>{error}</div>
            )}

            <div className='mb-3'>
              <label className='form-label'>Тема обращения</label>
              <input
                type='text'
                className='form-control'
                placeholder='Например, «Не открывается отчёт по продажам»'
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className='mb-3'>
              <label className='form-label'>Категория</label>
              <select
                className='form-select'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Отчёты</option>
                <option>Доступ и права</option>
                <option>Платёж</option>
                <option>Профиль</option>
                <option>Улучшения</option>
              </select>
            </div>

            <div className='mb-3'>
              <label className='form-label'>Описание проблемы</label>
              <textarea
                className='form-control'
                rows='4'
                placeholder='Кратко опишите, что вы делали до появления ошибки, и что видите на экране.'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className='mb-3'>
              <label className='form-label'>Приоритет</label>
              <div className='d-flex gap-3 small'>
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='radio'
                    id='priority-normal'
                    value='normal'
                    checked={priority === 'normal'}
                    onChange={(e) => setPriority(e.target.value)}
                  />
                  <label className='form-check-label' htmlFor='priority-normal'>
                    Обычный
                  </label>
                </div>
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='radio'
                    id='priority-high'
                    value='high'
                    checked={priority === 'high'}
                    onChange={(e) => setPriority(e.target.value)}
                  />
                  <label className='form-check-label' htmlFor='priority-high'>
                    Высокий
                  </label>
                </div>
              </div>
            </div>

            <div className='d-flex justify-content-end gap-2'>
              <button
                type='button'
                className='btn btn-outline-secondary'
                onClick={() => navigate('/initiator/tickets')}
              >
                Отмена
              </button>
              <button type='submit' className='btn btn-primary'>
                Создать тикет
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className='col-lg-5'>
        <div className='card border-0 shadow-sm mb-3'>
          <div className='card-body'>
            <h6 className='mb-2'>Как работает IntelliTicket для инициатора</h6>
            <ol className='small mb-0 ps-3'>
              <li>Вы входите в систему и создаёте новый тикет.</li>
              <li>ИИ-ассистент сразу предлагает возможное решение.</li>
              <li>
                Если ответ не помогает, тикет автоматически уходит оператору.
              </li>
              <li>После решения вы оцениваете качество обслуживания.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InitiatorCreateTicketPage;
