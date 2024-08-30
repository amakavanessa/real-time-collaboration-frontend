import { useState } from "react";

interface IconButtonProps {
  icon: JSX.Element;
  tooltip: string;
  onClick: Function;
}
const IconButton = ({ icon, tooltip, onClick }: IconButtonProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      onMouseOver={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className="relative flex justify-center items-center"
    >
      <button
        onClick={() => onClick()}
        className="text-gray-600 flex justify-center items-center w-7 h-7 rounded hover:bg-gray-100"
      >
        {icon}
      </button>

      {showTooltip && (
        <div className="absolute top-full flex-col flex items-center">
          <div className="arrow-up border-b-gray-700"></div>
          <div className="relative -top-[1px] text-[10px] text-center py-1 px-2  border-[0.5px] border-gray-900">
            {tooltip}
          </div>
        </div>
      )}
    </div>
  );
};

export default IconButton;
