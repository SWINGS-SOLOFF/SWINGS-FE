import React, { useEffect, useState } from "react";
import { fetchUserData, updateUserInfo } from "../api/userApi";
import { toast } from "react-toastify";

export default function IntroduceEditor() {
  const [text, setText] = useState("");
  const [username, setUsername] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await fetchUserData();
        setText(data.introduce || "");
        setUsername(data.username);
      } catch (err) {
        toast.error("유저 정보 불러오기 실패");
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const handleSave = async () => {
    try {
      await updateUserInfo(username, { introduce: text });
      toast.success("자기소개가 저장되었습니다!");
      setEditing(false);
    } catch (err) {
      toast.error("자기소개 저장 실패");
    }
  };

  if (loading) {
    return (
      <div className="text-gray-500 text-sm text-center py-8">로딩 중...</div>
    );
  }

  return editing ? (
    <div>
      <textarea
        className="w-full p-3 border border-gray-300 rounded-xl text-sm text-black"
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex justify-end mt-2 gap-2">
        <button
          onClick={() => setEditing(false)}
          className="bg-gray-200 px-3 py-1 text-sm rounded-full border-none outline-none focus:outline-none
"
        >
          취소
        </button>
        <button
          onClick={handleSave}
          className="bg-custom-pink text-white px-3 py-1 text-sm rounded-full border-none outline-none focus:outline-none
"
        >
          저장
        </button>
      </div>
    </div>
  ) : (
    <div className="relative">
      <p className="text-sm text-black leading-relaxed whitespace-pre-wrap">
        {text || "아직 자기소개가 없습니다."}
      </p>
      <div className="absolute top-0 right-0 flex gap-2">
        <button
          onClick={() => setEditing(true)}
          className="text-sm text-black border border-black rounded-md px-2 py-1 transition outline-none focus:outline-none
"
          title="자기소개 수정"
        >
          수정
        </button>
      </div>
      <br />
    </div>
  );
}
