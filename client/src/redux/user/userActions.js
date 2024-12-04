import { signInStart, signInSuccess, signInFailure, signoutSuccess } from './userSlice';

export const loginUser = (email, password) => async (dispatch) => {
  dispatch(signInStart());
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include',  // Send cookies with the request
    });

    const data = await res.json();

    if (res.ok) {
      dispatch(signInSuccess(data.user)); // Add user details to Redux state
    } else {
      dispatch(signInFailure(data.message)); // Handle error from the server
    }
  } catch (error) {
    dispatch(signInFailure(error.message)); // Handle network errors
  }
};







export const logoutUser = () => async (dispatch) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/logout`, {
      method: 'GET',
      credentials: 'include', // Ensure cookies are sent with the request
    });

    if (res.ok) {
      dispatch(signoutSuccess()); // Clear the user state on successful logout
    } else {
      console.error('Logout failed:', res.statusText);
    }
  } catch (error) {
    console.error('Logout failed:', error.message);
  }
};



