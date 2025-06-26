import React from "react";
import Image from "next/image";
import Typewriter from "typewriter-effect";

const Hero = () => {
  return (
    <section className="hero paddingDefault mt-10 pt-10" id="about">
      <div className="hero-left">
        <div
          className="mobile"
          id="aboutMobile"
          style={{ position: "relative", bottom: "125px" }}
        ></div>

        <h4 className="text-4xl" data-aos="flip-left">
          <Typewriter
            options={{
              delay: 20,
            }}
            onInit={(typewriter) => {
              typewriter.typeString("Hello, It’s Me").start();
            }}
          />
        </h4>
        <h3 className="text-5xl py-6" data-aos="zoom-in">
          <Typewriter
            options={{
              delay: 25,
            }}
            onInit={(typewriter) => {
              typewriter
                .pauseFor(400)
                .typeString("Rangga Arsy Prawira")
                .start();
            }}
          />
        </h3>
        <h4 className="text-4xl pb-6" data-aos="zoom-out">
          <Typewriter
            options={{
              delay: 20,
            }}
            onInit={(typewriter) => {
              typewriter
                .pauseFor(900)
                .typeString("And i’m a Backend Developer")
                .start();
            }}
          />
        </h4>
        <div data-aos="flip-left">
          <Typewriter
            options={{
              delay: 10,
            }}
            onInit={(typewriter) => {
              typewriter
                .pauseFor(1400)
                .typeString(
                  "I am Backend developer with more than 2 years experience,"
                )
                .start();
            }}
          />
          <Typewriter
            options={{
              delay: 9,
            }}
            onInit={(typewriter) => {
              typewriter
                .pauseFor(2300)
                .typeString(
                  "Expert in backend and friendly clean code"
                )
                .start();
            }}
          />
        </div>
        <div className="flex gap-5 mt-5">
          <Image
            src={"/assets/icon/icon_in.svg"}
            width={45}
            height={45}
            alt="icon"
            onClick={() => {
              window.open("https://www.linkedin.com/in/ranggarsy/");
            }}
          />
          <Image
            src={"/assets/icon/icon_email.svg"}
            width={45}
            height={45}
            alt="icon"
            onClick={() => {
              window.open("mailto:arsyrangga@gmail.com");
            }}
          />
          <Image
            src={"/assets/icon/icon_phone.svg"}
            width={46}
            height={46}
            alt="icon"
            onClick={() => {
              window.open("tel:+6289673494895");
            }}
          />
        </div>

        <button
          className="btnContactMe mt-6"
          data-aos="fade-up"
          data-aos-anchor-placement="top-bottom"
          data-aos-duration="2000"
          data-aos-delay="2600"
          data-aos-once="true"
          onClick={() => {
            window.open("https://wa.me/629673494895");
          }}
        >
          Contact Me
        </button>
      </div>
      <div
        className="hero-right"
        data-aos="flip-left"
        data-aos-easing="ease-out-cubic"
        data-aos-duration="2000"
      >
        <Image
          src={"/assets/images/rangga_arsy_prawira.png"}
          alt="profile_image"
          width={500}
          height={500}
        />
      </div>
    </section>
  );
};

export default Hero;
