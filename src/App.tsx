import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Download from './pages/Download'
import Navbar from './components/Navbar'
import JDList from './pages/JDList'
import Login from './pages/Login'

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  return (
    <>
    {!isLoginPage && <Navbar/>}
     <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/download" element={<Download />} />
       <Route path="/jds" element={<JDList />} />
       <Route path="/login" element={<Login />} />
    </Routes>
    </>
   
  )
}
export default App
