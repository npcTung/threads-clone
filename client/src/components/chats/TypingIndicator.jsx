import React from "react";

const TypingIndicator = () => {
  return (
    <div className="flex flex-row items-center space-x-3 max-w-fit bg-muted p-4 rounded-xl rounded-tl-none">
      <div className="text-sm">Typing</div>
      <div className="ticontainer">
        <div className="flex items-center h-[17px">
          <div className="tidot" />
          <div className="tidot" />
          <div className="tidot" />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
