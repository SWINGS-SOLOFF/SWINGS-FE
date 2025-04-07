import React, { useState, useRef, useEffect } from "react";

const TruncatedText = ({ text = "", maxLines = 3 }) => {
  const [expanded, setExpanded] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const textRef = useRef();

  useEffect(() => {
    const checkOverflow = () => {
      if (!textRef.current) return;

      const lineHeight = parseFloat(
        window.getComputedStyle(textRef.current).lineHeight
      );
      const maxHeight = lineHeight * maxLines;

      if (textRef.current.scrollHeight > maxHeight) {
        setShowMore(true);
      }
    };

    checkOverflow();
  }, [text, maxLines]);

  return (
    <div className="relative w-full">
      <p
        ref={textRef}
        className={`text-gray-700 text-sm whitespace-pre-line ${
          expanded ? "" : `line-clamp-${maxLines}`
        }`}
      >
        {text}
      </p>

      {!expanded && showMore && (
        <button
          onClick={() => setExpanded(true)}
          className="mt-1 text-xs text-blue-500 hover:underline"
        >
          ...더보기
        </button>
      )}
    </div>
  );
};

export default TruncatedText;
