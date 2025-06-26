import React from "react";
import TextDivider from "../divider/TextDivider";
import Image from "next/legacy/image";
import { imageList } from "@/constant/constantBackend";

const Skills = () => {
  return (
    <section className="mt-10 paddingDefault">
      <TextDivider text="Skills" id={"skills"}  />

      <div className="imageContainer">
        {imageList.map((e, i) => (
          <div
            className="imageWrap"
            key={i.toString()}
            data-aos={`flip-${
              (i + 1) % 3 === 0 ? "right" : (i + 1) % 3 === 1 ? "left" : "up"
            }`}
          >
            <Image
              src={e.url}
              alt={e.alt}
              layout="fill"
              objectFit="contain"
              style={{
                objectPosition:
                  (i + 1) % 3 === 0
                    ? "right"
                    : (i + 1) % 3 === 1
                    ? "left"
                    : "center",
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
