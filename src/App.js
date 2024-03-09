import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './pages/Home.js';
import Room from './pages/Room.js';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
    <Toaster position='top-right'></Toaster>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home></Home>}></Route>
      <Route path="/room/:roomId" element={<Room></Room>}></Route>
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
