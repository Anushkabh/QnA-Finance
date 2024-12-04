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

  useEffect(() => {
    // Fetch the user data to check if the user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/me`, {
          method: 'GET',
          credentials: 'include', // Ensure cookies are included
        });
        
        if (response.ok) {
          const data = await response.json();
          dispatch(setCurrentUser(data.user)); // Set the user data in Redux state
        } else {
          dispatch(setCurrentUser(null)); // If the response is not OK, clear user data
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        dispatch(setCurrentUser(null)); // If error occurs, clear user data
      }
    };

    checkAuth(); // Run the authentication check on app load
  }, [dispatch]);
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



