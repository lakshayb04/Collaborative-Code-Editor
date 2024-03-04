import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './pages/Home';
import Editor from './pages/Editor';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
    <Toaster position='top-right'></Toaster>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home></Home>}></Route>
      <Route path="/editor/:roomId" element={<Editor></Editor>}></Route>
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
