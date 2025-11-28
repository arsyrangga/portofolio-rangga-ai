import Image from "next/legacy/image";
import React, { useState } from "react";
import TabMenu from "./TabMenu";

const Navbar = () => {
  const [menu, setMenu] = useState(false);
  const handleMenu = () => {setMenu(!menu)};
  return (
    <nav className="navbarMain paddingDefault">
      <div className="flex nav-left" data-aos="fade-right" >
        <h3 className="brand">RANGGA</h3>
      </div>
      <div className="flex nav-right">
        {/* mobile */}
        <div
          className="mobile"
          onClick={handleMenu}
          data-aos="fade-down-left"
        >
          <Image
            src={"/assets/icon/icon_menu.svg"}
            width={50}
            height={50}
            alt="icon_menu"
            style={{
              transitionDelay: "unset !important",
              transitionDuration: "600ms !important",
              transform: menu ? "rotate(90deg)" : "rotate(0deg)",
            }}
          />
        </div>
        {/* mobile */}

        <span  data-aos="fade-down-right">
          <a href="#">Home</a>
        </span>
        <span  data-aos="fade-down-right">
          <a href="#about">About</a>
        </span>
        <span  data-aos="fade-down-right">
          <a href="#skills">Skills</a>
        </span>
        <span data-aos="fade-down-right">
          <a href="#portofolio">Portfolio</a>
        </span>
        <span  data-aos="fade-down-right">
          <a href="#contact">Contact</a>
        </span>
      </div>
      <TabMenu menu={menu} handleMenu={handleMenu} />
    </nav>
  );
};

export default Navbar;
