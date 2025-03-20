import AppRoutes from "./routes/AppRoutes";
import NavBar from "./components/NavBar";
import { AuthProvider } from "./context/AuthContext"; // ✅ AuthProvider 가져오기

function App() {
  return (
    <AuthProvider>
      {" "}
      {/* ✅ 전체 앱을 AuthProvider로 감싸야 함 */}
      <div className="App">
        <NavBar />
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

export default App;
