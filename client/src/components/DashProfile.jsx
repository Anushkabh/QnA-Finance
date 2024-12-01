import { Button } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/v1/user/logout', {
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
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <div className="border border-gray-300 rounded-md p-5 shadow-md">
        {/* Display Name */}
        <div className="mb-4">
          <h2 className="font-semibold text-lg">Name:</h2>
          <p>{currentUser?.name || 'N/A'}</p>
        </div>
        
        {/* Display Email */}
        <div className="mb-4">
          <h2 className="font-semibold text-lg">Email:</h2>
          <p>{currentUser?.email || 'N/A'}</p>
        </div>
      </div>

      {/* Conditional Button */}
      <div className="mt-5">
      {currentUser?.isAdmin ? (
    <Button 
      gradientDuoTone="purpleToBlue" 
      className="px-5 py-2 rounded-md shadow-lg text-black hover:bg-red-600 transition-all"
      onClick={handleSignout}
    >
      Sign Out
    </Button>
        ) : (
          <Link to="/ask-question">
            <Button gradientDuoTone="purpleToBlue" className="w-full">
              Ask a Question
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
