function App() {
    return (
        <div className="p-10">
            <h1 className="text-4xl font-bold text-blue-500">
                Hello, Tailwind CSS!
            </h1>
            <p className="text-lg text-gray-600 mt-2">
                Tailwind를 사용하면 빠르게 스타일을 적용할 수 있습니다.
            </p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                클릭하세요
            </button>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                반응형 Tailwind CSS
            </h1>

            <label className="block mb-2 text-gray-700">이메일</label>
            <input type="email" className="border rounded w-full p-2" placeholder="이메일 입력" />
        </div>


    );
}

export default App;
