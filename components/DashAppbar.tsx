"use client";
import { useState } from "react";

export const DashAppbar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };
  return (
    <nav className="border-gray-200 bg-gray-900 h-20 mx-auto flex items-center justify-between w-full">
      <div className="md:max-w-screen-2xl mx-auto flex items-center justify-between w-full">
        <div className="text-white text-lg">YT-Layer</div>
        {/* <div className="text-white w-96 ml-10">
            <form className=" mt-0">
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-4 h-4  text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  id="default-search"
                  className="block w-full p-3 ps-10 text-sm  border  rounded-lg    bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search Mockups, Logos..."
                  required
                />
                <div className="flex items-center text-center">
                  <button
                    type="submit"
                    className="text-white h-8 mb-1 mr-1 absolute end-1 bottom-1 text-center focus:ring-4 focus:outline-none  font-medium rounded-xl text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
                  >
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div> */}
        <div className=" items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button
            type="button"
            className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-600"
            id="user-menu-button"
            aria-expanded={dropdownVisible}
            onClick={toggleDropdown}
          >
            <span className="sr-only">Open user menu</span>
            <img
              className="w-8 h-8 rounded-full"
              src="/docs/images/people/profile-picture-3.jpg"
              alt="user photo"
            />
          </button>

          {dropdownVisible && (
            <div
              id="dropdownNavbar"
              className="absolute z-10 font-normal  divide-y  rounded-lg shadow w-44 bg-gray-700 divide-gray-600"
            >
              <ul
                className="py-2 text-sm text-gray-700 dark:text-gray-400"
                aria-labelledby="dropdownNavbarLink"
              >
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Settings
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Earnings
                  </a>
                </li>
              </ul>
              <div className="py-1">
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Sign out
                </a>
              </div>
            </div>
          )}

          <button
            data-collapse-toggle="navbar-user"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-lg md:hidden focus:outline-none focus:ring-2 text-gray-400 hover:bg-gray-700 focus:ring-gray-600"
            aria-controls="navbar-user"
            aria-expanded={mobileMenuVisible}
            onClick={toggleMobileMenu}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>

        <div
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
            mobileMenuVisible ? "" : "hidden"
          }`}
          id="navbar-user"
        ></div>
      </div>
    </nav>
  );
};
