import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { FiSearch } from "react-icons/fi";
import { MdNotificationsNone } from "react-icons/md";
import { BiCaretDown } from "react-icons/bi";
const Navbar = () => {
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div className={`nav ${scroll && "nav_black"}`}>
      {/* LEFT */}
      <div className="nav__left">
        <img
          className="nav__logo"
          src="https://upload.wikimedia.org/wikipedia/commons/f/fd/Netflix-Logo.png"
          alt="NETFLIX"
        />
        <ul className="nav__menu">
          <li className="active">Home</li>
          <li>Shows</li>
          <li>Movies</li>
          <li>Games</li>
          <li>New & Popular</li>
          <li>My List</li>
          <li>Browse by Languages</li>
        </ul>
      </div>
      {/* RIGHT */}
      <div className="nav__right">
        <FiSearch className="nav__icon" />
        <span className="nav__kids">Children</span>
        <MdNotificationsNone className="nav__icon" />
        <img
          className="nav__avatar"
          src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
          alt="avatar"
        />
        <BiCaretDown className="nav__icon small" />
      </div>
    </div>
  );
};

export default Navbar;
