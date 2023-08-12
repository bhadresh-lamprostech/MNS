import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './components/dashboard/Dashboard'

function App() {

  return (
    <>
      {/* <h1 className='text-center'>Shree Ganeshay Namah</h1> */}
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Dashboard/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
