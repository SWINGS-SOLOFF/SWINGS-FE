import React from "react";
import { PenSquare } from "lucide-react";

const CreatePostButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 bg-black text-white rounded-full p-3 shadow-lg hover:bg-gray-800 transition-all duration-300 z-40 flex items-center justify-center"
      aria-label="게시물 작성"
    >
      <PenSquare size={20} />
    </button>
  );
};

export default CreatePostButton;
