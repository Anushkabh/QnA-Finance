import { Button, Dropdown, Avatar, Navbar } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/user/userActions'; // Import logoutUser action
import { signoutSuccess } from '../redux/user/userSlice';
import { useState } from 'react';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Handle user logout
  const handleSignout = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/logout`, {
         
        method: 'GET',
        credentials: 'include', // Include cookies in the request
      });
  
      const data = await res.json();
      if (res.ok) {
        dispatch(signoutSuccess()); // Reset Redux state on successful logout
        navigate('/'); // Redirect to home page after logout
      } else {
        console.error('Logout failed:', data.message); // Log error if logout fails
      }
    } catch (error) {
      console.error('Logout failed:', error.message);   
    }
  };
  

  return (
    <Navbar className="border-b-2">
      {/* Logo */}
      <Link to="/" className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white">
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          Q
        </span>
        N
      </Link>

      {/* Search Bar */}
      <form onSubmit={(e) => { e.preventDefault(); navigate(`/?searchTerm=${searchTerm}`); }} className="flex items-center justify-center lg:justify-end">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="hidden lg:inline-block px-4 py-2 border border-gray-300 rounded-lg"
        />
        <Button type="submit" className="w-12 h-10 lg:hidden ml-2" color="gray" pill>
          Search
        </Button>
      </form>

      {/* User Authentication / Profile Dropdown */}
      <div className="flex gap-2 md:order-2">
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="user" img={currentUser.profilePicture} rounded />}
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.name}</span>
              <span className="block text-sm font-medium truncate">{currentUser.email}</span>
            </Dropdown.Header>
            <Link to="/dashboard">
              <Dropdown.Item>Dashboard</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign Out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="purpleToBlue" outline>
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>

      {/* Navbar Links */}
      <Navbar.Collapse>
        <Navbar.Link active={useLocation().pathname === '/'} as="div">
          <Link to="/">Home</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}

