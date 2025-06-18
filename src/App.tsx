import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Download from './pages/Download'
import Navbar from './components/Navbar'
import Joblist from './pages/Joblist'
import Login from './pages/Login'
import Analysis from './pages/Analysis'
import DummyAnalysis from './pages/DummyAnalysis'

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  return (
    <>
    {!isLoginPage && <Navbar/>}
     <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/download" element={<Download />} />
      <Route path="/jds" element={<Joblist />} />
      <Route path="/login" element={<Login />} />
      <Route path="/analysis" element={<Analysis />} />
      <Route path="/dummy" element={<DummyAnalysis />} />
    </Routes>
    </>
   
  )
}
export default App
