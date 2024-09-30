import React, { useEffect, useRef } from "react";
const CustomModal = ({ children, handleCloseModal, closeModal }) => {
  const model = useRef(null);

  const closeCloseModals = () => {
    handleCloseModal();
  };

  useEffect(() => {
    const clickHandler = (e) => {
      if (model.current && e.target === model.current) {
        handleCloseModal();
      }
    };

    document.addEventListener("click", (e) => clickHandler(e));
    return () => document.removeEventListener("click", clickHandler);
  }, [handleCloseModal]);

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!closeModal || keyCode !== 27) return;
      closeCloseModals();
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <div
      x-show="modalOpen"
      x-transition=""
      className="fixed top-0 left-0 z-[99999] flex h-full min-h-screen w-full items-center justify-center bg-gray-200 bg-opacity-70 "
      ref={model}
    >
      <div className="w-[90%] sm:w-2/3 lg:w-[500px] rounded-2xl bg-white relative">
        {children}
      </div>
    </div>
  );
};

export default CustomModal;
