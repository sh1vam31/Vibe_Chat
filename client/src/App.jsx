import React from 'react'
import {Route,Routes} from 'react-router-dom'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import ChatPage from './pages/ChatPage'

const App = () => {
  return (
    <div className="bg-[url('https://i.pinimg.com/736x/d0/5c/a8/d05ca86bbbca5e3dcc12205a1f67b224.jpg')] bg-contain">
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