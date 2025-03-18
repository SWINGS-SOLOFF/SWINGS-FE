import React, { useState } from "react";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [job, setJob] = useState("");
  const [golfSkill, setGolfSkill] = useState("");
  const [mbti, setMbti] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [religion, setReligion] = useState("");
  const [smoking, setSmoking] = useState("");
  const [drinking, setDrinking] = useState("");
  const [introduce, setIntroduce] = useState("");
  const [userImg, setUserImg] = useState("");
  const [gender, setGender] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleRegister = (event) => {
    event.preventDefault();
    console.log("회원가입 정보:", {
      username,
      password,
      name,
      phoneNumber,
      job,
      golfSkill,
      mbti,
      hobbies,
      religion,
      smoking,
      drinking,
      introduce,
      userImg,
      gender,
      role: "player", // 기본값 설정
      createdAt: new Date().toISOString(), // 가입 시간 자동 추가
    });
    // 회원가입 API 연동 로직 추가
  };

  return (
    <div className="register-form-container">
      <h2 className="text-xl font-semibold text-center text-green-700 mb-4">
        회원가입
      </h2>

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            아이디
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            이름
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            전화번호
          </label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label
            htmlFor="job"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            직업
          </label>
          <input
            type="text"
            id="job"
            value={job}
            onChange={(e) => setJob(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label
            htmlFor="golfSkill"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            골프 실력
          </label>
          <select
            id="golfSkill"
            value={golfSkill}
            onChange={(e) => setGolfSkill(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">선택</option>
            <option value="beginner">입문</option>
            <option value="intermediate">초급</option>
            <option value="advanced">중급</option>
            <option value="expert">고급</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="mbti"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            MBTI
          </label>
          <input
            type="text"
            id="mbti"
            value={mbti}
            onChange={(e) => setMbti(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label
            htmlFor="hobbies"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            취미
          </label>
          <input
            type="text"
            id="hobbies"
            value={hobbies}
            onChange={(e) => setHobbies(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label
            htmlFor="religion"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            종교
          </label>
          <input
            type="text"
            id="religion"
            value={religion}
            onChange={(e) => setReligion(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label
            htmlFor="introduce"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            자기소개
          </label>
          <textarea
            id="introduce"
            value={introduce}
            onChange={(e) => setIntroduce(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label
            htmlFor="userImg"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            프로필 이미지 URL
          </label>
          <input
            type="text"
            id="userImg"
            value={userImg}
            onChange={(e) => setUserImg(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
        >
          회원가입
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
