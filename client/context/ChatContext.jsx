import { createContext, useContext, useState,useEffect } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";


export const ChatContext = createContext();

export const ChatProvider = ({ children })=>{

    const [messages,setMessages] = useState([]);
    const [users,setUsers] = useState([]);
    const [selectedUser,setSelectedUser] = useState(null)
    const [unseenMessages,setUnseenMessages]= useState({})

    const {socket,axios,authUser} = useContext(AuthContext);

    //function to get all users for sidebar

   const getUsers = async () => {
    try {
        const { data } = await axios.get("/api/messages/users");  
        if (data.success) {
            setUsers(data.users);
            setUnseenMessages(data.unseenMessages);
        }
    } catch (error) {
        toast.error(error.message || "Failed to load users");
    }
};


    //function to get messages for selected user
    const getMessages = async (userId)=>{
        try {
        const {data}= await axios.get(`api/messages/${userId}`);
        if(data.success){
            setMessages(data.messages)
        }
        } catch (error) {
            toast.error(error.message)
        }
    }


    //function to send message to selected user
    const sendMessage = async (messageData)=>{
        try {
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`,messageData);
            if(data.success){
                setMessages((prevMessages)=>[...prevMessages,data.newMessage])
            }
            else{
                toast.error(data.message);
            }
        } catch (error) {
             toast.error(data.message);
        }
    }

    //function to subscribe to messages for selected user

    const subscribeToMessages = async () => {
        if(!socket) return;

        socket.on("newMessage", (newMessage)=>{
            if(selectedUser && newMessage.senderId === selectedUser._id){
                newMessage.seen = true;
                setMessages(prev => [...prev, newMessage]);
                // Fix: Correct API endpoint
                axios.get(`/api/messages/mark/${newMessage._id}`);
            } else {
                setUnseenMessages(prev => ({
                    ...prev,
                    [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1
                }));
            }
        });

        socket.on("messageDeleted", ({messageId, deleteFor}) => {
            if(deleteFor === 'everyone') {
                setMessages(prev => prev.filter(msg => msg._id !== messageId));
            }
        });
    }

    // function to unsubscribe from messages

    const unsubscribeFromMessage=()=>{
        if(socket) socket.off("newMessage")
    }
   
     useEffect( ()=>{
        subscribeToMessages();
        return ()=> unsubscribeFromMessage();
     },[socket,selectedUser])

     // Add this function in the ChatProvider component

const deleteMessage = async (messageId, deleteFor) => {
    try {
        console.log('Deleting message:', { messageId, deleteFor }); // Debug log
        
        const { data } = await axios.delete(`/api/messages/${messageId}`, {
            data: { deleteFor } // Send deleteFor in request body
        });

        if (data.success) {
            if (deleteFor === 'everyone') {
                setMessages(prev => prev.filter(msg => msg._id !== messageId));
            } else {
                setMessages(prev => prev.map(msg => 
                    msg._id === messageId 
                        ? {...msg, deletedFor: [...(msg.deletedFor || []), authUser._id]}
                        : msg
                ));
            }
            toast.success(`Message deleted ${deleteFor === 'everyone' ? 'for everyone' : 'for you'}`);
        }
    } catch (error) {
        console.error('Delete error:', error);
        toast.error(error.message || 'Failed to delete message');
    }
};

    // Add deleteMessage to the context value
    const value={
        messages,users,selectedUser,getUsers,getMessages,sendMessage,setSelectedUser,unseenMessages,setUnseenMessages,deleteMessage // Add this
    }

    return(
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}