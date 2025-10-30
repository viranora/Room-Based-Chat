import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';

function Lobby() {
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState(''); 
 
  const handleNavigate = (path) => {
    if (!username.trim()) {
      alert('Lütfen bir kullanıcı adı girin.');
      return;
    }

    navigate(path, { state: { username } }); 
  };

  const createNewRoom = () => {
    const newRoomId = uuidV4();
    handleNavigate(`/room/${newRoomId}`);
  };

  const joinRoom = (e) => {
    e.preventDefault();
    if (roomId.trim()) {
      handleNavigate(`/room/${roomId}`);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center text-cyan-400">
          Sohbet Lobisi
        </h1>

        <div className="pt-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-300">
            Kullanıcı Adınız
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Kullanıcı adınızı girin"
            className="w-full px-4 py-2 mt-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            autoComplete="off"
          />
        </div>

        <form onSubmit={joinRoom} className="space-y-4">
          <div>
            <label htmlFor="roomId" className="block text-sm font-medium text-gray-300">
              Oda ID'si ile Katıl
            </label>
            <input
              id="roomId"
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Oda ID'sini buraya yapıştırın"
              className="w-full px-4 py-2 mt-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-5 py-2 font-semibold bg-cyan-600 rounded-lg hover:bg-cyan-500 transition duration-200"
          >
            Odaya Katıl
          </button>
        </form>

        <div className="flex items-center justify-between">
          <span className="w-1/3 h-px bg-gray-600"></span>
          <span className="text-sm text-gray-400">VEYA</span>
          <span className="w-1/3 h-px bg-gray-600"></span>
        </div>

        <button
          onClick={createNewRoom}
          className="w-full px-5 py-2 font-semibold bg-gray-600 rounded-lg hover:bg-gray-500 transition duration-200"
        >
          Yeni Sohbet Odası Oluştur
        </button>
      </div>
    </div>
  );
}

export default Lobby;