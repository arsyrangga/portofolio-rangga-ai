import React from "react";

const TabMenu = ({
  menu,
  handleMenu,
}: {
  menu: boolean;
  handleMenu: () => void;
}) => {
  return (
    <div
      className="mobile tabMenu paddingDefault"
      style={{ transform: !menu ? "translateX(-900px)" : "translateX(0px)" }}
    >
      <a onClick={handleMenu} href="#">
        <span>Home</span>
      </a>
      <a onClick={handleMenu} href="#aboutMobile">
        <span>About</span>
      </a>
      <a onClick={handleMenu} href="#skills">
        <span>Skills</span>
      </a>
      <a onClick={handleMenu} href="#portofolioMobile">
        <span>Portfolio</span>
      </a>
      <a onClick={handleMenu} href="#contactMobile">
        <span>Contact</span>
      </a>
    </div>
  );
};

export default TabMenu;
