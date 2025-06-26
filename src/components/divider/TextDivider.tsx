import React from "react";

const TextDivider = ({ text, id }: { text: string; id: string }) => {
  return (
    <div className="mb-10 pb-10" data-aos="zoom-in-right" >
      <div style={{position : "relative", bottom : "100px"}} id={id}></div>
      <p className="text-4xl ">{text}</p>
      <div
        className="mt-2"
        style={{
          width: "100px",
          height: "5px",
          borderRadius: "20px",
          background: "#00D1FF",
        }}
      ></div>
    </div>
  );
};

export default TextDivider;
