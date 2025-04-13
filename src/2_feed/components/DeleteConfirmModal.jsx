import React from "react";

const DeleteConfirmModal = ({ visible, onCancel, onConfirm }) => {
  console.log("✅ DeleteConfirmModal 렌더링됨");

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-xs w-full text-center space-y-4 mx-4">
        <h3 className="text-xl font-bold text-gray-900">게시물 삭제</h3>
        <p className="text-gray-600">
          정말로 이 게시물을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <button
            onClick={onCancel}
            className="px-5 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            취소
          </button>
          <button
            type="button"
            onClick={() => {
              console.log("✅ 삭제 버튼 클릭됨"); // 로그 추가
              onConfirm();
            }}
            className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
