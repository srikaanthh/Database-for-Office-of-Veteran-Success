import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../Config/Config";
import { useAuth } from "./AuthContext";
import { IoMdLogOut, IoMdPerson, IoMdSettings } from "react-icons/io";
import { FiX, FiBell, FiSearch } from "react-icons/fi";
import { CgMenuLeftAlt } from "react-icons/cg";
import { MdDashboard, MdSchool, MdGroups, MdAssignment } from "react-icons/md";
import profile from "./itu.png";

const Navbar = () => {
  const { userType, setUserType, currentUser } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleUserMenu = () => setShowUserMenu(!showUserMenu);

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        setUserType("");
        navigate("/");
      })
      .catch((error) => console.error("Logout error:", error));
  };

  // Enhanced styling with gradients and shadows
  const baseLink = "px-6 py-3 rounded-2xl transition-all duration-300 font-medium group relative overflow-hidden";
  const linkStyles = baseLink + " text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-50";
  const activeLinkStyles = "bg-gradient-to-r from-green-100 to-gray-100 text-gray-700 font-semibold shadow-sm";

  // Icon mapping for menu items
  const iconMap = {
    "Dashboard": <MdDashboard className="text-lg" />,
    "Course Details": <MdSchool className="text-lg" />,
    "Enrollment": <MdGroups className="text-lg" />,
    "Results": <MdAssignment className="text-lg" />,
    "Registrations": <IoMdPerson className="text-lg" />,
    "Course Data": <MdSchool className="text-lg" />,
    "Instructors": <MdGroups className="text-lg" />,
    "Courses": <MdAssignment className="text-lg" />
  };

  const menuItems = {
    department: [
      { to: "/department-profile", label: "Dashboard" },
      { to: "/assign-courses", label: "Course Details" },
      { to: "/checkthenrollment", label: "Enrollment" },
      { to: "/assignResults", label: "Results" },
      { to: "/student-creation", label: "Registrations" },
    ],
    admin: [
      { to: "/registerdepartment", label: "Course Data" },
      { to: "/registerinstructor", label: "Instructors" },
      { to: "/registercourse", label: "Courses" },
    ],
    instructor: [{ to: "/instructor-profile", label: "Dashboard" }],
  };

  return (
    <nav className="w-full bg-white/95 backdrop-blur-2xl border-b border-gray-100/80 shadow-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Enhanced Logo + Title */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={profile}
              alt="University Logo"
              className="w-12 h-12 rounded-2xl border-2 border-white shadow-2xl"
            />
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-black-600 rounded-2xl blur-sm opacity-30 -z-10"></div>
          </div>
          <div>
            <span className="hidden sm:block text-gray-900 font-bold text-xl tracking-tight bg-gradient-to-r from-green-600 to-green-600 bg-clip-text text-transparent">
              Office of Veteran Success
            </span>
            <span className="hidden sm:block text-xs text-gray-500 font-medium uppercase tracking-wider">
              OVS Tutor System
            </span>
          </div>
        </div>

        {/* Enhanced Desktop Navigation */}
        {userType && (
          <div className="hidden lg:flex items-center space-x-2 bg-white/80 backdrop-blur-lg rounded-2xl p-2 border border-gray-100 shadow-lg">
            {menuItems[userType]?.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `${linkStyles} flex items-center space-x-2 ${
                    isActive ? activeLinkStyles : ""
                  }`
                }
              >
                {iconMap[item.label]}
                <span>{item.label}</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gray-500 to-green-600 transition-all duration-300 group-hover:w-full"></div>
              </NavLink>
            ))}
          </div>
        )}

        {/* Enhanced User Controls (Desktop) */}
        {userType && (
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <div className="flex items-center bg-gradient-to-r from-gray-50 to-gray-100/80 rounded-2xl px-4 py-2.5 shadow-inner border border-gray-200/60">
                <FiSearch className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none text-sm w-40 placeholder-gray-400"
                />
              </div>
            </div>

            

            {/* Enhanced User Menu */}
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-3 bg-gradient-to-r from-green-50 to-gray-50 hover:from-green-100 hover:to-gray-100 px-4 py-2.5 rounded-2xl transition-all duration-300 shadow-lg border border-gray-100/50 group"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-gray-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">
                    {currentUser?.email?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">
                    {currentUser?.email?.split('@')[0] || "User"}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{userType}</p>
                </div>
                <IoMdPerson className="text-gray-600 group-hover:text-gray-600 transition-colors" />
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-200/80 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{currentUser?.email}</p>
                    <p className="text-xs text-gray-500 capitalize">{userType} Account</p>
                  </div>
                  
                  
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50/80 transition-colors border-t border-gray-100"
                  >
                    <IoMdLogOut className="text-red-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Mobile Hamburger */}
        {userType && (
          <button
            className="md:hidden p-3 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100/80 hover:from-gray-50 hover:to-green-50 transition-all duration-300 shadow-inner border border-gray-200/60 group"
            onClick={toggleMenu}
          >
            {isOpen ? (
              <FiX size={20} className="text-gray-600 group-hover:text-green-600 transition-colors" />
            ) : (
              <CgMenuLeftAlt size={20} className="text-gray-600 group-hover:text-green-600 transition-colors" />
            )}
          </button>
        )}
      </div>

      {/* Enhanced Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 w-4/5 max-w-md h-full bg-gradient-to-br from-white to-gray-50/95 backdrop-blur-3xl rounded-r-3xl shadow-2xl transform transition-transform duration-500 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } z-50 border-r border-gray-200/60`}
      >
        <div className="flex flex-col h-full">
          {/* Enhanced Drawer Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200/60 bg-gradient-to-r from-gray-50/50 to-green-50/50">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={profile}
                  alt="University Logo"
                  className="w-12 h-12 rounded-2xl border-2 border-white shadow-xl"
                />
                <div className="absolute -inset-1 bg-gradient-to-r from-gray-500 to-green-600 rounded-2xl blur-sm opacity-30 -z-10"></div>
              </div>
              <div>
                <span className="text-gray-900 font-bold text-lg bg-gradient-to-r from-gray-600 to-green-600 bg-clip-text text-transparent">
                  USF Portal
                </span>
                <span className="block text-xs text-gray-500 font-medium uppercase tracking-wider">
                  {userType} Access
                </span>
              </div>
            </div>
            <button
              className="p-2 rounded-xl hover:bg-white/50 transition-colors duration-200 shadow-sm border border-gray-200/40"
              onClick={toggleMenu}
            >
              <FiX size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Enhanced Drawer Links */}
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
            {menuItems[userType]?.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={toggleMenu}
                className={({ isActive }) =>
                  `${baseLink} flex items-center space-x-4 mx-2 ${
                    isActive 
                      ? "bg-gradient-to-r from-gray-100 to-green-100 text-gray-700 shadow-inner border border-gray-200/50" 
                      : "text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-green-50 hover:text-gray-900"
                  }`
                }
              >
                <div className={`p-2 rounded-xl ${menuItems[userType]?.find(i => i.to === item.to) ? 'bg-gray-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                  {iconMap[item.label]}
                </div>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Enhanced Drawer Footer */}
          <div className="p-6 border-t border-gray-200/60 space-y-4 bg-gradient-to-r from-gray-50/80 to-gray-100/80">
            <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-lg rounded-2xl p-4 shadow-inner border border-gray-200/40">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">
                  {currentUser?.email?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {currentUser?.email || "User"}
                </p>
                <p className="text-xs text-gray-500 capitalize">{userType}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-2xl px-6 py-3.5 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold group"
            >
              <IoMdLogOut className="group-hover:scale-110 transition-transform" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden animate-fadeIn"
          onClick={toggleMenu}
        ></div>
      )}

      {/* Close user menu when clicking outside */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowUserMenu(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;