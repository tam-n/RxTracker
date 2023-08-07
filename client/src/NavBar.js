import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPills } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Disclosure } from '@headlessui/react';

export default function Navbar({ fixed }) {
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  return (
    <>
      <Disclosure
        as="nav"
        className="fixed w-screen top-0 flex items-center justify-between px-2 py-3 bg-light-gray-cloud text-merriweather text-rust-gray">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between layout-center">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <Link to="/">
              <div className="font-bold leading-relaxed mr-4 py-2 text-rust-gray text-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faPills} size="2xl" />
                <span className="mx-3">RxTracker</span>
              </div>
            </Link>
            <button
              className="cursor-pointer text-xl leading-none px-3 py-1 rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}>
              <FontAwesomeIcon icon={faBars} />
            </button>
          </div>
          <div
            className={
              'lg:flex flex-grow items-center justify-end' +
              (navbarOpen ? ' flex' : ' hidden')
            }
            id="example-navbar-danger">
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto text-merriweather">
              <li className="nav-item px-3 py-2 flex items-center text-xs font-bold leading-snug hover:opacity-75">
                <Link to="/mylist">
                  <span className="ml-2 text-base">My Lists</span>
                </Link>
              </li>
              <li className="nav-item px-3 py-2 flex items-center text-xs font-bold leading-snug hover:opacity-75">
                <Link to="">
                  <span className="ml-2 text-base">Login</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </Disclosure>
    </>
  );
}
