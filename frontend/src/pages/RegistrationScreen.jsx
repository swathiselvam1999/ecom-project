import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRegisterUserMutation } from '../slices/userApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';

const RegistrationScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect])

  const submitHandler = async (e) => {
    e.preventDefault();

    // Input Validation
    if (!name || !email || !password) {
      return toast.error('Please fill in all fields.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return toast.error('Invalid email format.');
    }
    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters long.');
    }

    try {
      const res = await registerUser({ name, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate('/');
    } catch (error) {
      console.error('Registration Error:', error);
      toast.error(error?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-4xl font-bold mb-6 text-center">Sign Up</h1>
      <form onSubmit={submitHandler}>
        <label className="block mb-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="input input-bordered w-full"
          />
        </label>
        <label className="block mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="input input-bordered w-full"
          />
        </label>
        <label className="block mb-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="input input-bordered w-full"
          />
        </label>
        <button
          type="submit"
          className="btn btn-primary w-full mb-5"
          disabled={isLoading}
        >
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
      <button 
        type="submit" 
        className="btn btn-primary w-full" 
        disabled={isLoading}
      >
        <Link to='/login'>  {isLoading ? 'Signing In...' : 'Sign In'}</Link>
      </button>
    </div>
  );
};

export default RegistrationScreen;
