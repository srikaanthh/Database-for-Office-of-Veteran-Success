import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "./AuthContext";
import logo from "./itu.png";
import { FiLock, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';

const SignIn = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { setUserType } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // ✅ Admin sign-in only
      if (password === 'ovsforveterans123#@') {
        setUserType('admin');
        navigate('/registerdepartment');
      } else {
        setError('Incorrect admin password. Please try again.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-usf-green-dark via-usf-green to-usf-green-light py-12 px-4 sm:px-6 lg:px-8">
      {/* Add custom USF color classes to your global CSS */}
      <style jsx>{`
        .bg-usf-green { background-color: #00543C; }
        .bg-usf-green-dark { background-color: #003D29; }
        .bg-usf-green-light { background-color: #006B4F; }
        .bg-usf-gold { background-color: #FDBB30; }
        .bg-usf-gold-light { background-color: #FED06E; }
        .text-usf-green { color: #00543C; }
        .text-usf-gold { color: #FDBB30; }
        .border-usf-green { border-color: #00543C; }
        .border-usf-gold { border-color: #FDBB30; }
        .hover\:bg-usf-green-dark:hover { background-color: #003D29; }
        .focus\:ring-usf-green:focus { ring-color: #00543C; }
        .focus\:border-usf-green:focus { border-color: #00543C; }
      `}</style>

      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-usf-gold">
        {/* Header Section with USF Colors */}
        <div className="bg-gradient-to-r from-usf-green to-usf-green-dark py-8 px-6 text-center relative">
          {/* USF Gold Accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-usf-gold"></div>
          
          <div className="flex justify-center mb-6">
            <img
              src={logo}
              alt="University Logo"
              className="w-24 h-24 rounded-full border-4 border-usf-gold shadow-lg"
            />
          </div>
          <h1 className="text-3xl font-bold text-black mb-2">Admin Portal</h1>
          <p className="text-usf-gold-light font-medium">Secure access to administration dashboard</p>
          
          {/* USF Gold decorative elements */}
          <div className="absolute bottom-2 left-4 w-3 h-3 rounded-full bg-usf-gold opacity-60"></div>
          <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-usf-gold opacity-40"></div>
        </div>

        {/* Form Section */}
        <div className="px-8 py-6">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-usf-green focus:border-usf-green transition-colors duration-200"
                  placeholder="Enter admin password"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-gray-400 hover:text-usf-green focus:outline-none focus:text-usf-green"
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5" />
                    ) : (
                      <FiEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-usf-green hover:bg-usf-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-usf-green transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <FiArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-8 p-4 bg-usf-green-light bg-opacity-10 rounded-lg border border-usf-green border-opacity-20">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-usf-green" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-usf-green">Secure Access</h3>
                <p className="text-sm text-usf-green-dark mt-1">
                  This portal is restricted to authorized administrators only.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
          <p className="text-xs text-center text-gray-500">
            © {new Date().getFullYear()} University of South Florida. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};


export default SignIn;
