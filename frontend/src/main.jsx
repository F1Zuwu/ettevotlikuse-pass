import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

//TAILWINDCSS + CUSTOM
import './index.css';

//JSX FILES TO ROUTE
import Home from './container/Frontpage/Home';
import Register from './container/Frontpage/Register';
import Login from './container/Frontpage/Login';
import Info from './container/Frontpage/Info';
import Funktsioonid from './container/Frontpage/Funktsioonid';
import Abi from './container/Frontpage/Abi';
import MinuPass from './container/Opilane/MinuPass';
import MinuTegevused from './container/Opilane/MinuTegevused';
import LisaTegevus from './container/Opilane/LisaTegevus';
import Kinnita from './container/Opilane/Kinnita';
import VaataRohkem from './container/Opilane/VaataRohkem';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const root = createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/info' element={<Info />} />
        <Route path='/funktsioonid' element={<Funktsioonid />} />
        <Route path='/abi' element={<Abi />} />

        <Route path='/mina/pass' element={<MinuPass />} />
        <Route path='/mina/tegevused' element={<MinuTegevused />} />
        <Route path='/mina/tegevused/lisa' element={<LisaTegevus />} />
        <Route path='/mina/tegevused/:id' element={<VaataRohkem />} />
        <Route path='/approve' element={<Kinnita />} />
      </Routes>
    </BrowserRouter>
  </GoogleOAuthProvider>
);

