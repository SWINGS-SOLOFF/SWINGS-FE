import React, { useState } from 'react';
import { FaUser, FaImage, FaTimes } from 'react-icons/fa';

const NewPostForm = ({
  newPostContent,
  setNewPostContent,
  handleImageChange,
  imagePreview,
  handleSubmit,
  setShowNewPostForm
}) => {
  // 폼 검증 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 폼 제출 핸들러 - 원래 핸들러를 감싸는 함수
  const onSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 이미지 없이도 폼 제출 가능
    try {
      handleSubmit(e);
    } catch (error) {
      console.error('게시물 업로드 중 오류:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 이미지 미리보기 초기화 함수
  const clearImagePreview = () => {
    const fileInput = document.getElementById('image-upload');
    if (fileInput) {
      fileInput.value = '';
    }
    handleImageChange({ target: { files: [] } });
  };

  // 텍스트가 검은색으로 보이도록 스타일 수정
  const textareaClass = "w-full p-4 border border-gray-300 rounded-lg h-36 focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none text-black";

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-6 border border-gray-200 transition-all duration-300 ease-in-out">
      <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4 border border-gray-300 shadow-sm">
            <FaUser className="text-xl text-gray-700" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">새 게시물 작성</h2>
        </div>
        <button 
          onClick={() => setShowNewPostForm(false)} 
          className="text-gray-500 hover:text-gray-800 transition-colors"
        >
          <FaTimes className="text-xl" />
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="mb-4">
          <label className="inline-block px-4 py-2 bg-black text-white text-sm font-medium rounded-lg cursor-pointer hover:bg-gray-800 transition-all duration-300 shadow-sm">
            <FaImage className="inline-block mr-2" />
            사진 업로드
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
          {imagePreview && (
            <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 relative group">
              <img src={imagePreview} alt="미리보기" className="w-full max-h-80 object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button 
                  type="button" 
                  onClick={clearImagePreview}
                  className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          )}
          
          {/* 이미지 없이도 업로드 가능함을 알리는 메시지 */}
          <p className="text-xs text-gray-500 mt-2">
            사진은 선택사항입니다. 텍스트만으로도 게시물을 작성할 수 있습니다.
          </p>
        </div>
        
        <div className="relative">
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            className={textareaClass}
            placeholder="게시물 내용을 입력하세요..."
            maxLength={500}
          ></textarea>
          <div className={`absolute bottom-3 right-3 text-xs ${newPostContent.length > 450 ? 'text-red-500' : 'text-gray-500'}`}>
            {newPostContent.length}/500
          </div>
        </div>
        
        <div className="pt-4 flex justify-end">
          <button
            type="button"
            onClick={() => setShowNewPostForm(false)}
            className="px-6 py-3 mr-3 text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            className={`px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 font-medium shadow-md transition-all duration-300 ${
              (!newPostContent.trim() && !imagePreview) ? 'opacity-50 cursor-not-allowed' : ''
            } ${isSubmitting ? 'opacity-50' : ''}`}
            disabled={(!newPostContent.trim() && !imagePreview) || isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                게시 중...
              </span>
            ) : (
              "게시하기"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPostForm;