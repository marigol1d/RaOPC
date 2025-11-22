import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';

import HomePage from './pages/HomePage.jsx';

import InitiatorTicketsPage from './pages/InitiatorTicketsPage.jsx';
import InitiatorCreateTicketPage from './pages/InitiatorCreateTicketPage.jsx';
import InitiatorTicketDetailsPage from './pages/InitiatorTicketDetailsPage.jsx';

import AgentInboxPage from './pages/AgentInboxPage.jsx';
import AgentTicketDetailsPage from './pages/AgentTicketDetailsPage.jsx';

import ManagerDashboardPage from './pages/ManagerDashboardPage.jsx';
import ManagerMetricsPage from './pages/ManagerMetricsPage.jsx';
import ManagerTicketsPage from './pages/ManagerTicketsPage.jsx';
import ManagerQualityPage from './pages/ManagerQualityPage.jsx';
import ManagerUsersPage from './pages/ManagerUsersPage.jsx';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path='/' element={<HomePage />} />

        {/* Роль инициатора */}
        <Route path='/initiator/tickets' element={<InitiatorTicketsPage />} />
        <Route
          path='/initiator/tickets/new'
          element={<InitiatorCreateTicketPage />}
        />
        <Route
          path='/initiator/tickets/:id'
          element={<InitiatorTicketDetailsPage />}
        />

        {/* Роль оператора */}
        <Route path='/agent/inbox' element={<AgentInboxPage />} />
        <Route path='/agent/tickets/:id' element={<AgentTicketDetailsPage />} />

        {/* Роль менеджера */}
        <Route path='/manager/dashboard' element={<ManagerDashboardPage />} />
        <Route path='/manager/metrics' element={<ManagerMetricsPage />} />
        <Route path='/manager/tickets' element={<ManagerTicketsPage />} />
        <Route path='/manager/quality' element={<ManagerQualityPage />} />
        <Route path='/manager/users' element={<ManagerUsersPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
