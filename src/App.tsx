import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Download from './pages/Download'
import Navbar from './components/Navbar'
import JDList from './pages/JDList'

function App() {
  return (
    <>
    <Navbar/>
     <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/download" element={<Download />} />
       <Route path="/jds" element={<JDList />} />
    </Routes>
    </>
   
  )
}
export default App
