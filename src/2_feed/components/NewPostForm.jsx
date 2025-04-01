import React from 'react';
import { FaUser } from 'react-icons/fa';

const NewPostForm = ({
                         newPostContent,
                         setNewPostContent,
                         handleImageChange,
                         imagePreview,
                         handleSubmit,
                         setShowNewPostForm
                     }) => {
    return (
        <div className="bg-white p-5 rounded-lg shadow-md mb-6 border border-green-200">
            <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 border border-green-500">
                    <FaUser className="text-xl text-green-700" />
                </div>
                <h2 className="text-xl font-semibold text-green-800">새 게시물 작성</h2>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-green-700 mb-2 font-medium">사진 업로드</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50"
                    />
                    {imagePreview && (
                        <div className="mt-3 rounded-lg overflow-hidden border border-green-300">
                            <img src={imagePreview} alt="미리보기" className="w-full max-h-80 object-cover" />
                        </div>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-green-700 mb-2 font-medium">내용</label>
                    <textarea
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        className="w-full p-3 border border-green-300 rounded-lg h-28 focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50"
                        placeholder="골프 모임에 대한 이야기를 공유해보세요..."
                    ></textarea>
                </div>
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => setShowNewPostForm(false)}
                        className="px-5 py-3 mr-3 text-green-800 border-2 border-green-500 rounded-lg hover:bg-green-50 font-medium"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className="px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-md"
                        disabled={!newPostContent.trim()}
                    >
                        게시하기
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewPostForm;
