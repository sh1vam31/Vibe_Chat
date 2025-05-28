import React, { useContext, useEffect,useRef, useState } from 'react'
import assets, { messagesDummyData } from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { Trash2 } from 'lucide-react'; // Add this import
import { formatDateForGrouping } from "../utils/formatDate";
import { useNavigate } from "react-router-dom";

const ChatContainer = () => {

  const {messages,selectedUser,setSelectedUser,sendMessage,getMessages ,deleteMessage} = useContext(ChatContext);
  const { authUser , onlineUsers } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const scrollEnd = useRef()

  const [input,setInput] = useState('')
  const [showDeleteOptions, setShowDeleteOptions] = useState(null);

// Handle sending a message
  const handleSendMessage = async (e)=>{
    e.preventDefault();
    if(input.trim() == "") return null;
    await sendMessage({text: input.trim()});
    setInput("")
  }

// handle sending an Image

  const handleSendImage = async (e)=>{
    const file = e.target.files[0];
    if(!file || !file.type.startsWith("image/")){
      toast.error("select an image file")
      return;
    }
    const reader = new FileReader();

    reader.onloadend = async ()=>{
      await sendMessage({image: reader.result})
      e.target.value = ""
    }
    reader.readAsDataURL(file);
  }

  useEffect( ()=>{
    if(selectedUser){
      getMessages(selectedUser._id)
    }
  },[selectedUser])


  useEffect( ()=> {
    if(scrollEnd.current && messages){
      scrollEnd.current.scrollIntoView({behavior:"smooth"})
    }
  },[messages])

  // Filter and group messages by date
  const groupMessagesByDate = (messages) => {
    // Filter out deleted messages first
    const filteredMessages = messages.filter(msg => 
        !msg.deletedFor?.includes(authUser._id)
    );
    
    const groups = {};
    
    filteredMessages.forEach(msg => {
        const date = formatDateForGrouping(msg.createdAt);
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(msg);
    });
    
    return groups;
};

  return selectedUser? (
    <div className='h-full overflow-y-scroll relative backdrop-blur-lg ' > 
     
          {/* ------- Header ------- */}
          <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className='w-8 rounded-full' /> 
        <p className='flex-1 text-lg text-white flex items-center gap-2' >
            {selectedUser.fullName} 
           {onlineUsers.includes(selectedUser._id) && <span  className='w-2 h-2 rounded-full bg-green-500'></span>}
        </p>      
        <img onClick={ ()=> setSelectedUser(null)} src={assets.arrow_icon} alt="" className='md:hidden max-w-7' />
        <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5' />     
     </div>

       {/* ---------- Chat area ---------- */} 

       <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>

         {Object.entries(groupMessagesByDate(messages)).map(([date, dateMessages]) => (
            <div key={date} className="mb-6">
                <div className="flex justify-center mb-4">
                    <span className="bg-gray-800 text-gray-300 text-xs px-4 py-1 rounded-full">
                        {date}
                    </span>
                </div>
                
                {dateMessages.map((msg, index) => (
                    // Remove the deleted message check since we already filtered them
                    <div 
                        key={index} 
                        className={`group flex items-end gap-2 justify-end relative ${
                            msg.senderId !== authUser._id && 'flex-row-reverse'
                        }`}
                        onMouseLeave={() => setShowDeleteOptions(null)}
                    >
                        {msg.image ? (
                            <div className="relative">
                                <img 
                                    src={msg.image} 
                                    alt="" 
                                    className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8' 
                                />
                                {/* Delete icon */}
                                <Trash2 
                                    className="hidden group-hover:block absolute top-0 right-0 w-4 h-4 
                                        cursor-pointer text-red-500 hover:text-red-600"
                                    onClick={() => setShowDeleteOptions(msg._id)}
                                />
                            </div>
                        ) : (
                            <div className="relative">
                                <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 
                                    break-all bg-violet-500/30 text-white ${
                                        msg.senderId === authUser._id ? 'rounded-br-none' : 'rounded-bl-none'
                                    }`
                                }
                                >
                                    {msg.text}
                                </p>
                                {/* Delete icon */}
                                <Trash2 
                                    className="hidden group-hover:block absolute top-0 right-0 w-4 h-4 
                                        cursor-pointer text-red-500 hover:text-red-600"
                                    onClick={() => setShowDeleteOptions(msg._id)}
                                />
                            </div>
                        )}
                        
                        {/* Delete options popup */}
                        {showDeleteOptions === msg._id && (
                            <div className={`absolute ${
            msg.senderId === authUser._id 
                ? 'right-0' 
                : 'left-0'
            } top-0 bg-gray-800 rounded-lg shadow-lg p-2 z-10`}
        >
            <button 
                className="block w-full text-left px-4 py-2 text-sm text-white 
                    hover:bg-gray-700 rounded"
                onClick={() => {
                    deleteMessage(msg._id, 'me');
                    setShowDeleteOptions(null);
                }}
            >
                Delete for me
            </button>
            {msg.senderId === authUser._id && (
                <button 
                    className="block w-full text-left px-4 py-2 text-sm text-white 
                        hover:bg-gray-700 rounded"
                    onClick={() => {
                        deleteMessage(msg._id, 'everyone');
                        setShowDeleteOptions(null);
                    }}
                >
                    Delete for everyone
                </button>
            )}
        </div>
                        )}

                        <div className='text-center text-xs'>
                            <img 
                                src={msg.senderId === authUser._id 
                                    ? authUser?.profilePic || assets.avatar_icon
                                    : selectedUser?.profilePic || assets.avatar_icon} 
                                alt="" 
                                className='w-7 rounded-full'
                            />
                            <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p>
                        </div>
                    </div>
                ))}
            </div>
        ))}
         <div ref={scrollEnd} ></div>
       </div>

              {/* -------- Bottom Area ------- */}
              <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
                <div className='flex-1 flex items-center bg-blue-100/15 px-3 rounded-full'>
                  <input onChange={(e)=>setInput(e.target.value)} value={input} onKeyDown={(e)=> e.key === "Enter" ? handleSendMessage(e) : null} type="text" placeholder='send a message....' className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-white-400'/>
                  <input onChange={handleSendImage} type="file" id="image" accept='image/png,image/jpeg' hidden />
                  <label htmlFor="image"> 
                    <img src={assets.gallery_icon} alt="" className='w-5 mr-2 cursor-pointer' />
                  </label>
                </div>
                <img onClick={handleSendMessage} src={assets.send_button} alt="" className='w-7 cursor-pointer'/>
              </div>
              

    </div>

  ):
  <div className='flex flex-col items-center justify-center gap-2 text-gray-300'>
    <img src={assets.logo_icon} alt="" className='max-w-16' />
    <p className='text-lg font-medium text-white'>🤘Where Vibes Connect, Conversations Begin.🤘</p>
    <button
      onClick={() => navigate('/viberoom')}
      className="px-3 py-1 bg-violet-500 text-white rounded-lg hover:bg-violet-600"
    >
      Start VibeRoom
    </button>
  </div>
}

export default ChatContainer