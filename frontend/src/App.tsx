import { BrowserRouter } from 'react-router-dom'
import './App.css'
import useSocket from './hooks/useSocket'
import AppRoutes from './routes/AppRoutes'
import useAuthSync from './hooks/useAuthSync'

function App() {
  useAuthSync()
  useSocket()
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,

      }}>
      <div className="w-[100vw] ">
        <AppRoutes />
      </div>
    </BrowserRouter>
  )
}

export default App
