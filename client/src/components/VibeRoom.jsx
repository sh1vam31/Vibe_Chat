import { useState, useContext, useRef, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { useParams, useLocation, useNavigate } from "react-router-dom";

function getYouTubeEmbedUrl(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}`
    : null;
}

const VibeRoom = () => {
  const { authUser } = useContext(AuthContext);
  const { users, sendMessage } = useContext(ChatContext);
  const [videoUrl, setVideoUrl] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  const [invitedUsers, setInvitedUsers] = useState([]);
  const [liveChat, setLiveChat] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const scrollEnd = useRef(null);
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const videoParam = new URLSearchParams(location.search).get("video");

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [liveChat]);

  useEffect(() => {
    if (videoParam) setVideoUrl(videoParam);
  }, [videoParam]);

  const handleInviteUser = (user) => {
    if (invitedUsers.includes(user._id)) return;
    if (invitedUsers.length >= 5) {
      toast.error("You can invite up to 5 users only.");
      return;
    }
    setInvitedUsers([...invitedUsers, user._id]);
  };

  const handleRemoveUser = (userId) => {
    setInvitedUsers(invitedUsers.filter(id => id !== userId));
  };

  const handleStartVibe = async () => {
    const embed = getYouTubeEmbedUrl(videoUrl);
    if (!embed) {
      toast.error("Please enter a valid YouTube video URL");
      return;
    }
    if (invitedUsers.length === 0) {
      toast.error("Invite at least one user to start the VibeRoom.");
      return;
    }
    setEmbedUrl(embed);
    toast.success("VibeRoom started! Enjoy together.");

    // Generate a unique room ID
    const roomId = uuidv4();

    // Send an invite message to each invited user
    for (const userId of invitedUsers) {
      await sendMessage(
        JSON.stringify({
          type: "viberoom-invite",
          from: authUser._id,
          fromName: authUser.fullName,
          to: userId,
          videoUrl,
          roomId,
        }),
        userId
      );
    }

    // Navigate the creator to the room
    navigate(`/viberoom/${roomId}?video=${encodeURIComponent(videoUrl)}`);
  };

  const handleSendLiveChat = () => {
    if (!chatInput.trim()) return;
    setLiveChat([...liveChat, {
      sender: authUser.fullName,
      text: chatInput,
      time: new Date().toISOString(),
    }]);
    setChatInput("");
  };

  return (
    <div className="min-h-screen bg-[#1F2937] text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 py-3 px-4 border-b border-stone-500">
        <img
          src={authUser?.profilePic || assets.avatar_icon}
          alt=""
          className="w-8 h-8 rounded-full"
        />
        <p className="flex-1 text-lg font-semibold">
          VibeRoom: Watch YouTube Together
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 p-4 overflow-hidden">
        {/* Video & Invite Section */}
        <div className="flex-1 bg-[#111827] rounded-lg p-4 flex flex-col mb-4 md:mb-0">
          {/* YouTube Link Input & Invite */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Paste YouTube video URL:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="flex-1 p-2 bg-gray-800 rounded-lg outline-none text-white"
              />
              <button
                onClick={handleStartVibe}
                className="bg-violet-500 px-4 py-2 rounded-lg hover:bg-violet-600 whitespace-nowrap"
              >
                Start VibeRoom
              </button>
            </div>
          </div>
          {/* Invite Users */}
          <div className="mb-4">
            <p className="mb-2 text-sm">Invite up to 5 friends:</p>
            <div className="flex flex-wrap gap-2">
              {users
                .filter(u => u._id !== authUser._id)
                .map(user => (
                  <button
                    key={user._id}
                    className={`px-3 py-1 rounded-full text-sm ${
                      invitedUsers.includes(user._id)
                        ? "bg-violet-500 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-violet-700"
                    }`}
                    onClick={() =>
                      invitedUsers.includes(user._id)
                        ? handleRemoveUser(user._id)
                        : handleInviteUser(user)
                    }
                  >
                    {user.fullName}
                    {invitedUsers.includes(user._id) && " ✓"}
                  </button>
                ))}
            </div>
          </div>
          {/* Video Player */}
          <div className="flex-1 flex items-center justify-center min-h-[240px]">
            {embedUrl ? (
              <iframe
                width="100%"
                height="100%"
                src={embedUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg aspect-video w-full max-h-[60vh] bg-black"
              ></iframe>
            ) : (
              <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center text-gray-400">
                Paste a YouTube link and invite friends to start!
              </div>
            )}
          </div>
        </div>

        {/* Live Chat Section */}
        <div className="w-full md:w-[370px] min-w-[260px] max-w-[400px] bg-[#111827] rounded-lg flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            {liveChat.length === 0 && (
              <div className="text-gray-400 text-center mt-10">No messages yet. Start chatting!</div>
            )}
            {liveChat.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-end gap-2 mb-2 ${
                  msg.sender === authUser.fullName
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div className="relative">
                  <p
                    className={`p-2 max-w-[200px] text-sm font-light rounded-lg break-all ${
                      msg.sender === authUser.fullName
                        ? "bg-violet-500/30 rounded-br-none"
                        : "bg-gray-700 rounded-bl-none"
                    } text-white`}
                  >
                    <span className="font-semibold">{msg.sender}: </span>
                    {msg.text}
                  </p>
                </div>
              </div>
            ))}
            <div ref={scrollEnd}></div>
          </div>
          {/* Chat Input */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendLiveChat()}
                placeholder="Type a message..."
                className="flex-1 bg-gray-800 rounded-full px-4 py-2 outline-none"
              />
              <button
                onClick={handleSendLiveChat}
                className="p-2 rounded-full bg-violet-500 hover:bg-violet-600"
              >
                <img src={assets.send_button} alt="" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VibeRoom;