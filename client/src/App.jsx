// import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import Home from './pages/Home';

import SignIn from './pages/SignIn';
import { setCurrentUser } from './redux/user/userSlice'; 
import Dashboard from './pages/Dashboard';

import SignUp from './pages/SignUp';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute';
import AskQuestion from './pages/CreateQuestion';
import UpdateQuestion from './pages/UpdateQuestion';
import PostPages from './pages/QuestionPages';
import ScrollToTop from './components/ScrollToTop';
import Search from './pages/Search';
import QuestionDetails from './pages/Questiondetail';
export default function App() {


  const dispatch = useDispatch();

 
  return (
    <BrowserRouter>
      <ScrollToTop/>
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
     
        <Route path="/sign-in" element={<SignIn/>}/>
        <Route path='/search' element={<Search />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        
        </Route>
        
        <Route path="/update-question/:questionId" element={<UpdateQuestion/>}/>
        <Route path="/sign-up" element={<SignUp/>}/>
       
        <Route path="/ask-question" element={<AskQuestion/>}/>
        <Route path="/question/:questionId/all" element={<QuestionDetails />} />
        <Route path="/question/:questionId" element={<PostPages/>}/>
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}



