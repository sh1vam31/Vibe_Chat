import React, { useContext, useState } from 'react';
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';

const LoginPage = () => {
  const [currState, setCurrState] = useState('Sign up');
  const [fullName, setfullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (currState === 'Sign up' && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }
    try {
      await login(currState === 'Sign up' ? 'signup' : 'login', {
        fullName,
        email,
        password,
        bio,
      });
    } catch (error) {
      console.error('Login error:', error.message);
    }
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 flex items-center justify-center text-white text-[10vw] font-bold opacity-10 animate-zoom-move pointer-events-none">
        Vibe Chat
      </div>

      {/* --------- Left Section --------- */}
      <div className="flex flex-col items-center gap-2 mx-10 max-sm:mt-10 z-10">
        <img
          src={assets.logo_icon}
          alt="Logo"
          className="w-[min(15vw,120px)] max-w-32 aspect-square transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-lg"
        />
        <h1 className="text-4xl font-semibold text-white tracking-wide">Vibe Chat</h1>
      </div>

      {/* --------- Right Section --------- */}
      <form
        onSubmit={onSubmitHandler}
        className="bg-white/10 text-white border border-gray-400 p-8 flex flex-col gap-6 rounded-lg shadow-xl max-w-md w-full z-10"
      >
        <h2 className="font-semibold text-2xl flex justify-between items-center">
          {currState}
          {isDataSubmitted && (
            <img
              onClick={() => setIsDataSubmitted(false)}
              src={assets.arrow_icon}
              alt="Back"
              className="cursor-pointer w-5"
            />
          )}
        </h2>

        {currState === 'Sign up' && (
          <input
            onChange={(e) => setfullName(e.target.value)}
            value={fullName}
            type="text"
            className="p-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Full Name"
            required
          />
        )}

        {!isDataSubmitted && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email"
              required
              className="p-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              required
              className="p-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </>
        )}

        {currState === 'Sign up' && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            className="p-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Bio"
          ></textarea>
        )}

        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-md font-medium hover:opacity-90 transition-opacity"
        >
          {currState === 'Sign up' ? 'Create Account' : 'Login Now'}
        </button>

        <div className="flex items-center gap-2 text-sm text-gray-300">
          <input type="checkbox" required />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        <div className="text-center text-sm text-gray-300">
          {currState === 'Sign up' ? (
            <p>
              Already have an account?{' '}
              <span
                onClick={() => {
                  setCurrState('Login');
                  setIsDataSubmitted(false);
                }}
                className="font-medium text-indigo-400 cursor-pointer hover:underline"
              >
                Login here
              </span>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <span
                onClick={() => {
                  setCurrState('Sign up');
                }}
                className="font-medium text-indigo-400 cursor-pointer hover:underline"
              >
                Sign up here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;