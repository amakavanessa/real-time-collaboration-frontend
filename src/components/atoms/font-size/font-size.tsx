import { useContext, useState } from "react";
import { EditorContext } from "../../../contexts/editor-context";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";

const FontSize = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  const { fontSize, setFontSize } = useContext(EditorContext);
  const handleSetFontSize = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      setFontSize(value);
    }
  };

  const increaseFontSize = () => {
    setFontSize((prevSize) => prevSize + 1);
  };

  const decreaseFontSize = () => {
    setFontSize((prevSize) => (prevSize > 1 ? prevSize - 1 : prevSize));
  };

  return (
    <div className="relative flex justify-center items-center">
      <button
        onMouseOver={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="flex justify-between items-center text-xs text-gray-600 px-2 h-7 space-x-4 hover:bg-gray-100 rounded"
      >
        <input
          type="text"
          value={fontSize}
          onChange={handleSetFontSize}
          className="w-5 text-center outline-none"
        />
        <div className="flex flex-col items-center">
          <ChevronUpIcon className="w-2 h-2" onClick={increaseFontSize} />
          <ChevronDownIcon className="w-2 h-2" onClick={decreaseFontSize} />
        </div>
      </button>

      {showTooltip && (
        <div className="absolute top-full flex-col flex items-center">
          <div className="arrow-up border-b-gray-700"></div>
          <div className="relative -top-[1px] -right-8 text-[10px] text-center py-1 px-2  border-[0.5px] border-gray-900">
            font size
          </div>
        </div>
      )}
    </div>
  );
};

export default FontSize;
