import { NavLink } from 'react-router-dom';

function Layout({ children }) {
  return (
    <div className='app-shell'>
      <nav className='navbar navbar-expand-lg navbar-light bg-white border-bottom'>
        <div className='container'>
          <NavLink className='navbar-brand d-flex align-items-center' to='/'>
            <img
              src='/logo-intelliticket.svg'
              alt='IntelliTicket'
              className='navbar-brand-logo'
            />
            <span className='fw-semibold ms-1'>IntelliTicket</span>
          </NavLink>

          <button
            className='navbar-toggler'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#mainNav'
          >
            <span className='navbar-toggler-icon' />
          </button>

          <div className='collapse navbar-collapse' id='mainNav'>
            <ul className='navbar-nav ms-auto mb-2 mb-lg-0'>
              <li className='nav-item'>
                <NavLink className='nav-link' to='/'>
                  Главная
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className='app-main'>
        <div className='container'>{children}</div>
      </main>

      <footer className='border-top py-3 text-center small text-muted bg-white'>
        IntelliTicket – умный тикет-сервис со встроенным ИИ-ассистентом
      </footer>
    </div>
  );
}

export default Layout;
