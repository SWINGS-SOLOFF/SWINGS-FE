import React from "react";
import { PenSquare } from "lucide-react";

// 게시물 작성 버튼
const CreatePostButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-6 bg-pink-600 text-white rounded-full p-3 shadow-lg hover:bg-pink-700 transition-all duration-300 z-[60] flex items-center justify-center"
      aria-label="게시물 작성"
    >
      <PenSquare size={20} />
    </button>
  );
};

export default CreatePostButton;
