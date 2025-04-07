import React from 'react';
import { FaPlusCircle, FaRandom, FaListUl } from 'react-icons/fa';

const FeedHeader = ({
  sortMethod,
  toggleSortMethod,
  filterOption,
  toggleFilterOption,
  showNewPostForm,
  setShowNewPostForm
}) => {
  return (
    <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm py-3 px-4 mb-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        {/* 피드 제목 및 정렬/필터 버튼 */}
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-bold text-gray-900">피드</h1>
          <button
            onClick={toggleSortMethod}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition"
          >
            <FaRandom className="text-xs" />
            {sortMethod === 'latest' ? '최신순' : '랜덤'} 정렬
          </button>
          <button
            onClick={toggleFilterOption}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition"
          >
            <FaListUl className="text-xs" />
            {filterOption === 'all' ? '전체 피드' : '팔로잉 피드'}
          </button>
        </div>

        {/* 새 게시물 버튼 */}
        <button
          onClick={() => setShowNewPostForm(!showNewPostForm)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition shadow-sm"
        >
          <FaPlusCircle className="text-base" />
          <span className="text-sm font-medium hidden sm:inline">새 게시물 작성</span>
        </button>
      </div>
    </div>
  );
};

export default FeedHeader;
