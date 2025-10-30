import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; 
import { socket } from './socket';

const formatTime = (timestamp) => {
  if (!timestamp) return ''; 
  return new Date(timestamp).toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

function ChatRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  
  const location = useLocation(); 
  const [username, setUsername] = useState('');

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const [typingUsers, setTypingUsers] = useState({}); 

  const typingTimeoutRef = useRef(null); 

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  
  useEffect(() => {
    
    if (location.state && location.state.username) {
      const lobiUsername = location.state.username;
      setUsername(lobiUsername);
      
      socket.emit('join_room', { roomId, username: lobiUsername });
    } else {
      alert('Odaya girmek için önce bir kullanıcı adı belirlemelisiniz.');
      navigate('/');
    }

    const onReceiveMessage = (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    const onUserTyping = ({ username, id }) => {

      setTypingUsers((prev) => ({ ...prev, [id]: username }));
    };

    const onUserStopsTyping = (id) => {
      setTypingUsers((prev) => {
        const newTypingUsers = { ...prev };
        delete newTypingUsers[id];
        return newTypingUsers;
      });
    };
    
    socket.on('receive_message', onReceiveMessage);
    socket.on('user_typing', onUserTyping); 
    socket.on('user_stops_typing', onUserStopsTyping); 

    return () => {
      socket.off('receive_message', onReceiveMessage);
      socket.off('user_typing', onUserTyping); 
      socket.off('user_stops_typing', onUserStopsTyping); 
      socket.emit('leave_room', roomId);
    };
  }, [roomId, navigate, location.state]); 

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const messageData = {
        text: message,
        id: socket.id, 
        roomId: roomId, 
        username: username 
      };
      
      socket.emit('send_message', messageData);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      socket.emit('typing_stop', { roomId });
      
      setMessage('');
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);

    if (!typingTimeoutRef.current) {
      socket.emit('typing_start', { roomId });
    } else {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing_stop', { roomId });
      typingTimeoutRef.current = null; 
    }, 2000); 
  };
  
  const leaveRoom = () => {
    navigate('/'); 
  };

  const typingUserList = Object.entries(typingUsers)
    .filter(([id, name]) => id !== socket.id) 
    .map(([id, name]) => name); 


  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="flex items-center justify-between bg-gray-800 shadow-md p-4">
        <div>
          <h1 className="text-xl font-bold text-cyan-400">Sohbet Odası</h1>
          <p className="text-xs text-gray-400 truncate">
            Oda ID: {roomId}
          </p>
        </div>
        <button 
          onClick={leaveRoom}
          className="bg-red-600 text-white font-semibold rounded-lg px-4 py-1 hover:bg-red-500 transition duration-200"
        >
          Ayrıl
        </button>
      </header>

      <main className="flex-grow p-4 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          
          {messages.map((msg, index) => {
            const isMe = msg.id === socket.id; 
            
            return (
              <div
                key={index}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`} // Yönü flex-col ve items-* ile belirle
              >
                { !isMe && (
                  <span className="text-xs text-cyan-300 mb-1 ml-3">
                    {msg.username || 'Bilinmeyen'}
                  </span>
                )}
                
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow ${
                    isMe
                      ? 'bg-cyan-600 rounded-br-none' 
                      : 'bg-gray-700 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm text-gray-100 break-words">{msg.text}</p>
                  <span className={`block text-xs mt-1 ${
                    isMe ? 'text-cyan-200 text-right' : 'text-gray-400 text-right'
                  }`}>
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="bg-gray-800 p-4 shadow-inner">
        
        <div className="h-5 text-xs text-gray-400 italic">
          {typingUserList.length > 0 && (
            <span>
              {typingUserList.join(', ')} 
              {typingUserList.length > 1 ? ' yazıyorlar...' : ' yazıyor...'}
            </span>
          )}
        </div>
        
        <form onSubmit={sendMessage} className="flex space-x-3">
          <input
            type="text"
            value={message}
            onChange={handleTyping} 
            placeholder="Bir mesaj yaz..."
            className="flex-grow bg-gray-700 border border-gray-600 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            autoComplete="off"
          />
          <button
            type="submit"
            className="bg-cyan-600 text-white font-semibold rounded-full px-5 py-2 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 transition duration-200"
          >
            Gönder
          </button>
        </form>
      </footer>
    </div>
  );
}

export default ChatRoom;