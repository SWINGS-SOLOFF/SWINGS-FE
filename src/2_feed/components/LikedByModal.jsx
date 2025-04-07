import React from "react";
import { normalizeImageUrl } from "../utils/imageUtils";
import { useNavigate } from "react-router-dom";

const LikedByModal = ({ users, onClose }) => {
  const navigate = useNavigate();

  if (!users || users.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white rounded-xl overflow-hidden max-w-md w-full max-h-[80vh]">
        <div className="p-4 border-b flex items-center">
          <h3 className="font-bold text-lg">좋아요 한 사용자</h3>
          <button
            onClick={onClose}
            className="ml-auto text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto max-h-[60vh]">
          {users.map((user) => (
            <div
              key={user.userId}
              className="flex items-center p-4 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                navigate(`/swings/profile/${user.userId}`);
                onClose();
              }}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                <img
                  src={
                    user.profilePic ||
                    normalizeImageUrl("/images/default-profile.jpg")
                  }
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold">{user.username}</p>
                {user.name && (
                  <p className="text-sm text-gray-500">{user.name}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LikedByModal;
