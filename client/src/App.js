import { Routes, Route } from 'react-router-dom';
import Lobby from './Lobby';
import ChatRoom from './ChatRoom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Lobby />} />

      <Route path="/room/:roomId" element={<ChatRoom />} />
    </Routes>
  );
}

export default App;