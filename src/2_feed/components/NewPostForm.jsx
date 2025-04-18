import React, { useState } from "react";
import { FaUser, FaImage, FaTimes } from "react-icons/fa";

const NewPostForm = ({
  newPostContent,
  setNewPostContent,
  handleSubmit,
  setShowNewPostForm,
  selectedImage,
  setSelectedImage,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const onSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      handleSubmit(e, selectedImage);
    } catch (error) {
      console.error("게시물 업로드 중 오류:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resizeImage = (file, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const scaleSize = maxWidth / img.width;
          canvas.width = maxWidth;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(
            (blob) => {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            },
            file.type,
            quality
          );
        };
      };
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const resizedImage = await resizeImage(file, 800, 0.8);

    setImagePreview(URL.createObjectURL(resizedImage));
    setSelectedImage(resizedImage);
  };

  const clearImagePreview = () => {
    const fileInput = document.getElementById("image-upload");
    if (fileInput) {
      fileInput.value = "";
    }
    setImagePreview(null);
    setSelectedImage(null);
  };

  return (
    <div className="fixed inset-0 bg-transparent z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden border-2 border-gray-200">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <h2 className="text-lg font-bold flex items-center text-gray-800">
            NEW FEED
          </h2>
          <button
            onClick={() => setShowNewPostForm(false)}
            className="text-gray-400 hover:text-black p-1 rounded-full hover:bg-gray-100 transition"
          >
            <FaTimes />
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="overflow-y-auto max-h-[calc(80vh-70px)] py-2 px-3 custom-scrollbar"
        >
          <div className="space-y-4">
            {/* 이미지 업로드 버튼 */}
            <div className="outline-none focus:outline-none flex justify-between items-center">
              <button
                type="button"
                className="p-2 text-black hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all"
              >
                <label className="cursor-pointer flex items-center gap-1">
                  <FaImage className="text-xl text-custom-pink" />
                  <span className="text-sm text-gray-700 font-medium">
                    업로드
                  </span>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </button>
            </div>

            {/* 이미지 미리보기 */}
            {imagePreview && (
              <div className="mt-2 rounded-lg overflow-hidden border border-gray-300 relative group">
                <img
                  src={imagePreview}
                  alt="미리보기"
                  className="w-full max-h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={clearImagePreview}
                    className="bg-white text-black p-2 rounded-full hover:bg-gray-100"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            )}

            {/* 텍스트 영역 */}
            <div className="relative">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg h-36 focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none text-black"
                placeholder="게시물 내용을 입력하세요..."
                maxLength={500}
              ></textarea>
              <div
                className={`absolute bottom-3 right-3 text-xs ${
                  newPostContent.length > 450 ? "text-red-500" : "text-gray-700"
                }`}
              >
                {newPostContent.length}/500
              </div>
            </div>

            {/* 버튼 영역 */}
            <div className="pt-3 flex justify-end mt-3">
              {" "}
              <button
                type="button"
                onClick={() => setShowNewPostForm(false)}
                className="px-4 py-2 mr-2 text-pink-700 border border-pink-300 rounded-full hover:bg-pink-50 font-medium transition-colors text-sm"
              >
                취소
              </button>
              <button
                type="submit"
                className={`px-4 py-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 font-medium shadow-sm transition-all duration-300 text-sm ${
                  !newPostContent.trim() && !imagePreview
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                } ${isSubmitting ? "opacity-50" : ""}`}
                disabled={
                  (!newPostContent.trim() && !imagePreview) || isSubmitting
                }
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    게시 중...
                  </span>
                ) : (
                  "게시하기"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPostForm;
