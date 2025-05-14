import React from 'react'
import {Route,Routes} from 'react-router-dom'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import ChatPage from './pages/ChatPage'
import Layout from './Layout'; 
import VibeRoom from './pages/VibeRoom'

const App = () => {
  return (
    <div className="bg-[url('./assets/background4.jpg')] bg-contain">
       {/* setting routes for every pages */}
       
      <Routes>
       <Route path='/login' element={<LoginPage/>} />
       <Route path='/profile' element={<ProfilePage/>} />

       {/* Routes with layout */}
        <Route element={<Layout />}>
          
          <Route path="/" element={<ChatPage />} />
          <Route path="/vibeRoom" element={<VibeRoom/>} />
            </Route>
      </Routes>

    </div>
  )
}

export default App