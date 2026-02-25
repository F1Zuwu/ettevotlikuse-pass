import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

//TAILWINDCSS + CUSTOM
import './index.css';

//JSX FILES TO ROUTE
import Home from './container/Frontpage/Home';
import Register from './container/Frontpage/Register';


const root = createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/register' element={<Register />} />
    </Routes>
  </BrowserRouter>
);

