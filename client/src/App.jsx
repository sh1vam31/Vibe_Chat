import React from 'react'
import {Route,Routes} from 'react-router-dom'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import ChatPage from './pages/ChatPage'

const App = () => {
  return (
    <div className="bg-[url('./assets/background5.jpg')] bg-contain">
       {/* setting routes for every pages */}
       
      <Routes>
       <Route path='/' element={<ChatPage/>} />
       <Route path='/login' element={<LoginPage/>} />
       <Route path='/profile' element={<ProfilePage/>} />
      </Routes>

    </div>
  )
}

export default App