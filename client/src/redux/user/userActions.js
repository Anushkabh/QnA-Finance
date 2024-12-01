import { signInStart, signInSuccess, signInFailure, signoutSuccess } from './userSlice';

export const loginUser = (email, password) => async (dispatch) => {
  dispatch(signInStart());
  try {
    const res = await fetch('/api/v1/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
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
    const res = await fetch('/api/v1/user/logout', {
      method: 'GET',
      credentials: 'include', // Make sure to include the cookies in the request
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


