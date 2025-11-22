function HomePage() {
  return (
    <div className='hero'>
      <div className='row g-4 align-items-center'>
        <div className='col-lg-6'>
          <h1 className='hero-title mb-3'>
            IntelliTicket – тикет-сервис, который сначала отвечает ИИ
          </h1>
          <p className='hero-subtitle mb-4'>
            Пользователь создаёт тикет, встроенный ИИ-ассистент предлагает
            мгновенное решение, оператор подключается только к сложным случаям,
            а менеджер видит живые метрики качества сервиса.
          </p>
          <div className='d-flex flex-wrap gap-2'>
            <a href='/initiator/tickets' className='btn btn-primary'>
              Перейти к тикетам инициатора
            </a>
          </div>
        </div>

        <div className='col-lg-6'>
          <div className='card hero-card p-3 p-md-4'>
            <div className='d-flex justify-content-between mb-3'>
              <span className='fw-semibold'>Пример диалога с ИИ</span>
              <span className='badge badge-status-ai'>Ответ ИИ-ассистента</span>
            </div>
            <h6 className='mb-1'>Не открывается отчёт по продажам</h6>
            <p className='text-muted small mb-3'>
              Категория: Отчёты · Приоритет: высокий
            </p>
            <div className='message-thread'>
              <div className='message-bubble message-bubble-user'>
                <div className='message-meta mb-1'>Вы · 10:21</div>
                После нажатия «Сформировать отчёт» появляется пустой экран.
              </div>
              <div className='message-bubble message-bubble-ai'>
                <div className='message-meta mb-1'>
                  IntelliTicket AI · 10:22
                </div>
                Похоже, что у вас нет доступа к исходным данным. Проверьте права
                на раздел «Продажи» и попробуйте выполнить отчёт ещё раз.
              </div>
            </div>
            <p className='small text-muted mt-3 mb-0'>
              Если подсказка ИИ не помогает, тикет автоматически уходит
              оператору службы поддержки.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
