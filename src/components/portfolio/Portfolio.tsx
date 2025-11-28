import React, { useCallback, useState } from "react";
import TextDivider from "../divider/TextDivider";
import { projectData } from "@/constant/constant";
import Image from "next/legacy/image";
import ImageViewer from "react-simple-image-viewer";
import Modal from "../modal/Modal";

const Portfolio = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({imageUrl: "", title: "", description: ""});


  return (
    <section className="pt-10 mt-10 paddingDefault">
      <TextDivider text="Portfolio" id="portofolio" />
      <div
        className="mobile"
        id="portofolioMobile"
        style={{ position: "relative", bottom: "225px" }}
      ></div>

      <div className="imageContainerPortfolio">
        {projectData.map((e, i) => (
          <div
            className="imageWrapPortfolio"
            key={i.toString()}
            data-aos={`zoom-in-${
              (i + 1) % 3 === 0 ? "right" : (i + 1) % 3 === 1 ? "left" : "down"
            }`}
            onClick={()=>{
              setIsModalOpen(true)
              setModalData({imageUrl: e.image, title: e.title, description: e.content})
            }}
          >
            <Image
              src={e.image}
              alt={e.title}
              layout="fill"
              objectFit="cover"
              style={{
                objectPosition:
                  (i + 1) % 3 === 0
                    ? "right"
                    : (i + 1) % 3 === 1
                    ? "left"
                    : "center",
                borderRadius: "15px",
                border: "4px solid #00D1FF",
              }}
            />
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageUrl={modalData.imageUrl}
        title={modalData.title}
        description={modalData.description}
      />
     
    </section>
  );
};

export default Portfolio;
