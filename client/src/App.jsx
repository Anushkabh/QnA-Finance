// import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Project';
import SignUp from './pages/SignUp';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute';
import AskQuestion from './pages/CreatePost';
import UpdateQuestion from './pages/UpdatePost';
import PostPages from './pages/PostPages';
import ScrollToTop from './components/ScrollToTop';
import Search from './pages/Search';
import QuestionDetails from './pages/Questiondetail';
export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop/>
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/sign-in" element={<SignIn/>}/>
        <Route path='/search' element={<Search />} />
        
          <Route path="/dashboard" element={<Dashboard/>}/>
       
      
          <Route path="/update-question/:questionId" element={<UpdateQuestion/>}/>
          
       
        
        <Route path="/sign-up" element={<SignUp/>}/>
        <Route path="/projects" element={<Projects/>}/>
        <Route path="/ask-question" element={<AskQuestion/>}/>
        <Route path="/question/:questionId/all" element={<QuestionDetails />} />
        <Route path="/question/:questionId" element={<PostPages/>}/>
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}



