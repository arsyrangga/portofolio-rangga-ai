// components/Modal.tsx
import { useEffect, useRef } from "react";
import Image from "next/image";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  description: string;
}

const Modal = ({
  isOpen,
  onClose,
  imageUrl,
  title,
  description,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg pt-6 pl-6 pr-6 max-w-2xl w-full mx-4 modal-containers"
        style={{
          maxHeight: "calc(100vh - 10rem)",
          overflowY: "auto",
        }}
      >
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-4xl mb-5"
          >
            ×
          </button>
        </div>
        <div className="w-100">
          <img src={imageUrl} alt={title} className="w-full rounded" />
        </div>
        <div style={{ position: "sticky", bottom: "0", background: "#fff" }} className="py-5">
          <h2 className="text-xl font-bold mb-2 text-gray-600">{title}</h2>
          <p
            className="text-gray-600"
            dangerouslySetInnerHTML={{ __html: description }}
          ></p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
