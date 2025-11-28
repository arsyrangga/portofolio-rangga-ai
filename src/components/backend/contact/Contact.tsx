import React, { useState } from "react";
import TextDivider from "../divider/TextDivider";
import Image from "next/legacy/image";

const Contact = () => {
  const [contact, setContact] = useState({
    nama: "",
    email: "",
    phone: "",
    msg: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (contact.nama != "" && contact.email != "" && contact.msg !== "") {
      window.location.href = `https://api.whatsapp.com/send?phone=6289673494895&text=Name%20%3A%20${contact.nama}%0AEmail%20%3A%20${contact.email}%0ANo%Phone%20%3A%20${contact.phone}%0APesan%20%3A%20${contact.msg}%0A`;
    } else {
      alert("Please Fill Form");
    }
  };
  return (
    <section className="mt-10 pt-10 pb-10 mb-10 paddingDefault">
      <TextDivider text="Contact" id="contact" />
      <div
        className="mobile"
        id="contactMobile"
        style={{ position: "relative", bottom: "225px" }}
      ></div>
      <div className="contact mb-10 pb-10">
        <div className="contact-left">
          <input
            type="text"
            className="inputContact"
            placeholder="ENTER YOUR NAME*"
            data-aos="fade-right"
            data-aos-offset="300"
            data-aos-easing="ease-in-sine"
            onChange={handleChange}
            value={contact.nama}
            name="nama"
          />
          <input
            type="text"
            className="inputContact"
            placeholder="ENTER YOUR EMAIL*"
            data-aos="fade-right"
            data-aos-offset="300"
            data-aos-easing="ease-in-sine"
            onChange={handleChange}
            name="email"
            value={contact.email}
          />
          <input
            type="text"
            className="inputContact"
            placeholder="PHONE NUMBER"
            data-aos="fade-right"
            data-aos-offset="300"
            data-aos-easing="ease-in-sine"
            name="phone"
            onChange={handleChange}
            value={contact.phone}
          />
          <textarea
            className="areaContact"
            placeholder="YOUR MESSAGE*"
            data-aos="fade-right"
            data-aos-offset="300"
            data-aos-easing="ease-in-sine"
            onChange={handleChange}
            name="msg"
            value={contact.msg}
          />
          <div className="flex justify-center">
            <button
              className="buttonContact"
              data-aos="fade-right"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
        <div className="contact-right">
          <div
            className="grouper-contact"
            data-aos="fade-right"
            data-aos-easing="ease-in-sine"
            onClick={() => {
              window.open("https://www.linkedin.com/in/ranggarsy/");
            }}
          >
            <Image
              src={"/assets/icon/icon_in.svg"}
              width={40}
              height={40}
              alt="in"
            />
            <span className="text-md ml-4">Linkedin</span>
          </div>
          <div
            className="grouper-contact"
            data-aos="fade-right"
            data-aos-easing="ease-in-sine"
            onClick={() => {
              window.open("mailto:arsyrangga@gmail.com");
            }}
          >
            <Image
              src={"/assets/icon/icon_email.svg"}
              width={40}
              height={40}
              alt="in"
            />
            <span className="text-md ml-4">arsyrangga@gmail.com</span>
          </div>
          <div
            className="grouper-contact"
            data-aos="fade-right"
            data-aos-easing="ease-in-sine"
            onClick={() => {
              window.open("tel:+6289673494895");
            }}
          >
            <Image
              src={"/assets/icon/icon_phone.svg"}
              width={40}
              height={40}
              alt="in"
            />
            <span className="text-md ml-4">+62-896-7349-4895</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
