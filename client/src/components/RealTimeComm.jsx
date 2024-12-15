import { useState, useEffect, useContext } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import io from 'socket.io-client';
import { AuthContext } from '../contexts/AuthContextFile';

const socket = io(`${import.meta.env.VITE_BACKEND_URL}`, {
  withCredentials: true,
});

const RealTimeComm = () => {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/messages`, {
          credentials: 'include',
        });
        const data = await response.json();
        setMessages(data);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    };

    // Fetch messages when the component mounts
    fetchMessages();

    if (user && user.email) {
      socket.emit('user_login', user.email);
    }

    socket.on('receive_message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const sendMessage = () => {
    if (message.trim() && user) {
      const newMessage = {
        senderEmail: user.email,
        message,
      };

      socket.emit('send_message', newMessage);

      setMessage('');
    }
  };

  return (
    <div className="w-[70%] h-[80%] border-2 border-mlsa-sky-blue relative rounded-md">
      <div className="overflow-y-auto h-[90%] p-4 space-y-2">
        {messages.map((msg, index) => (
          <div key={index} className="text-sm p-2 bg-gray-200 rounded-md">
            <strong>{msg.senderName || 'Anonymous'}</strong>: {msg.message}
            <div className="text-xs text-gray-500">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
      <div className="w-full absolute bottom-0 flex items-center justify-between bg-mlsa-sky-blue px-1 py-1">
        <input
          className="w-[92%] h-10 rounded-bl-md bg-mlsa-bg text-white px-3 flex items-center justify-center"
          placeholder="Enter your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <div className="flex items-center justify-center h-full w-[8%]">
          <PaperAirplaneIcon
            className="h-9 w-9 text-mlsa-sky-blue bg-mlsa-bg p-2 rounded-full cursor-pointer"
            onClick={sendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default RealTimeComm;