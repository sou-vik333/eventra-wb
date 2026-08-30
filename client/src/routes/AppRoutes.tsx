import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import HomePage from '../pages/home/HomePage'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<MainLayout />}>

          <Route path="/" element={<HomePage />} />

        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes