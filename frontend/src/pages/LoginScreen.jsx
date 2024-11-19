import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../slices/userApiSlice';
import { setCredentials } from "../slices/authSlice";
import { toast } from 'react-toastify';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loginApiCall, { isLoading }] = useLoginMutation();

    const { userInfo } = useSelector((state) => state.auth);

    const { search } = useLocation();

    const sp = new URLSearchParams(search);

    const redirect = sp.get("redirect") || "/";

    useEffect(() => {
      if(userInfo){
        navigate(redirect);
      }
    }, [userInfo, redirect])

    const submitHandler = async (e) => {
        e.preventDefault();

        if (email === '' || password === '') {
            alert('Please fill in all fields');
        } else {
            try {
              const res = await loginApiCall({ email, password }).unwrap();

              dispatch(setCredentials({...res})); 
              
              navigate('/');
            } catch (error) {
                toast.error(error.data.message);
            }
        }
    };

    return (
        <div>
            <h1 className="text-4xl font-bold mb-6">Sign In</h1>
            <form className="w-full" onSubmit={submitHandler}>
                <label className="input input-bordered flex items-center gap-2 mb-5">
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="grow"
                    />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="grow"
                    />
                </label>
                <div className='flex gap-3'>
                <button type="submit" className="btn btn-primary mt-5" disabled={isLoading}>
                    {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
                <button type="submit" className="btn btn-primary mt-5" disabled={isLoading}>
                    <Link to='/register'>  {isLoading ? 'Signing Up...' : 'Sign Un'}</Link>
                </button>
                </div>
            </form>
        </div>
    );
};

export default LoginScreen;
