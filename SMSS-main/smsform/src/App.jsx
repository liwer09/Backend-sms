import { Inicio } from './componentes/Inicio/Inicio';
import { NavbarPrimary } from './componentes/Navbar/Navbar';
import HistoryTableUsers from './componentes/History/HistoryUsers';
import HistoryTableGroups from './componentes/History/HistoryGroups';
import HistoryTableSms from './componentes/History/HistorySms';
import './App.css';
import { Routes, Route } from 'react-router-dom';
// import { useMsal, useMsalAuthentication } from '@azure/msal-react';
// import { InteractionType } from '@azure/msal-browser'; 
// import { useState } from 'react';

function App() {
  // useMsalAuthentication(InteractionType.Redirect);
  // const [m_strUser, setm_strUser] = useState("");

  // function Render(){

  //   const { accounts } = useMsal();

  //   try {
  //     const username = accounts[0].username;
  //     setm_strUser(username);
  //   } catch (error) {
  //   }
  // }

  // if (m_strUser != "") {
    return (
      <div className='General'>
        <Routes>
          <Route path="/" element={<> <NavbarPrimary /> <Inicio /> </>} />
          <Route path="tablesms/:id" element={<> <NavbarPrimary /> <HistoryTableSms /> </>} />
          <Route path="tableusers/:id" element={<> <NavbarPrimary /> <HistoryTableUsers /> </>} />
          <Route path="tablegroups/:id" element={<> <NavbarPrimary /> <HistoryTableGroups /> </>} />
        </Routes>

      </div>
    );
  }
  
// }

export default App;
