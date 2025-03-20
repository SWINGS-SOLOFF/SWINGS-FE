import AppRoutes from "./routes/AppRoutes";
import NavBar from "./components/NavBar"; // ✅ NavBar import

function App() {
  return (
    <div className="App">
      <NavBar /> {/* ✅ NavBar 컴포넌트 사용 */}
      {/* 라우트 설정 */}
      <AppRoutes />
    </div>
  );
}

export default App;
