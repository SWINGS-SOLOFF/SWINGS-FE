import React from "react";

const FeedHeader = ({
  sortMethod,
  toggleSortMethod,
  filterOption,
  toggleFilterOption,
  showNewPostForm,
  setShowNewPostForm,
}) => {
  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 z-10 px-4 py-2 flex items-center justify-between">
      <h1 className="text-lg font-semibold text-gray-800">피드</h1>

      <div className="flex space-x-2">
        <button
          onClick={toggleFilterOption}
          className="text-sm px-3 py-1 rounded-full border bg-gray-50 hover:bg-gray-100 transition"
        >
          {filterOption === "all" ? "전체 피드" : "팔로잉 피드"}
        </button>
        <button
          onClick={toggleSortMethod}
          className="text-sm px-3 py-1 rounded-full border bg-gray-50 hover:bg-gray-100 transition"
        >
          {sortMethod === "latest" ? "최신순" : "랜덤순"}
        </button>
        <button
          onClick={() => setShowNewPostForm(!showNewPostForm)}
          className="text-sm px-3 py-1 rounded-full border bg-black text-white hover:bg-gray-800 transition"
        >
          {showNewPostForm ? "작성 취소" : "✍️ 게시물 작성"}
        </button>
      </div>
    </div>
  );
};

export default FeedHeader;
