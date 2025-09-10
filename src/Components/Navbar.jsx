import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../Config/Config";
import { useAuth } from "./AuthContext";
import { IoMdLogOut, IoMdPerson } from "react-icons/io";
import { FiX } from "react-icons/fi";
import { CgMenuLeftAlt } from "react-icons/cg";
import profile from "./itu.png";

const Navbar = () => {
  const { userType, setUserType, currentUser } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        setUserType("");
        navigate("/");
      })
      .catch((error) => console.error("Logout error:", error));
  };

  const baseLink =
    "px-4 py-2 rounded-md transition-all duration-300 font-medium border-2 border-usfgold";
  const linkStyles =
    baseLink + " hover:bg-usfgold hover:text-usfgreen";
  const activeLinkStyles =
    "bg-white text-usfgreen font-semibold shadow";

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
    <nav className="w-full bg-usfgreen backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo + Title */}
        <div className="flex items-center space-x-3">
          <img
            src={profile}
            alt="University Logo"
            className="w-12 h-12 rounded-full border-2 border-usfgold"
          />
          <span className="hidden sm:block text-black font-bold text-lg ">
            Office of Veteran Success
          </span>
        </div>

        {/* Desktop Nav */}
        {userType && (
          <div className="hidden md:flex items-center space-x-3">
            {menuItems[userType]?.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `${linkStyles} ${
                    isActive ? activeLinkStyles : "text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}

        {/* User + Logout (Desktop) */}
        {userType && (
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center bg-usfgold text-usfgreen px-3 py-1 rounded-full text-sm font-medium shadow">
              <IoMdPerson className="mr-1" />
              {currentUser?.email || "User"}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-white transition"
            >
              <IoMdLogOut className="mr-1 text-lg" /> Logout
            </button>
          </div>
        )}

        {/* Mobile Hamburger */}
        {userType && (
          <button
            className="md:hidden text-white p-2 rounded-md hover:bg-usfgold hover:text-usfgreen transition"
            onClick={toggleMenu}
          >
            {isOpen ? <FiX size={26} /> : <CgMenuLeftAlt size={26} />}
          </button>
        )}
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 w-4/5 max-w-sm h-full bg-usfgreen rounded-r-2xl shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } z-50`}
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-usfgold">
            <div className="flex items-center space-x-2">
              <img
                src={profile}
                alt="University Logo"
                className="w-10 h-10 rounded-full border-2 border-usfgold"
              />
              <span className="text-black font-bold text-md border-2 border-usfgold px-2 py-1 rounded-md">
                USF Portal
              </span>
            </div>
            <button
              className="text-black hover:text-usfgold"
              onClick={toggleMenu}
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Drawer Links */}
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-3">
            {menuItems[userType]?.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={toggleMenu}
                className={({ isActive }) =>
                  `${linkStyles} block ${
                    isActive ? activeLinkStyles : "text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-usfgold space-y-3">
            <div className="flex items-center bg-usfgold text-usfgreen px-3 py-2 rounded-full text-sm font-medium shadow">
              <IoMdPerson className="mr-1" />
              {currentUser?.email || "User"}
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-md px-4 py-3 transition"
            >
              <IoMdLogOut className="mr-2 text-lg" /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={toggleMenu}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
