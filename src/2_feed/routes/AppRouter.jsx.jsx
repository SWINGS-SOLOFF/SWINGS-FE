import UserRoutes from "../1_user/routes/UserRoutes";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* ✅ UserRoutes는 "/" 경로에서 시작 */}
        <Route path="/*" element={<UserRoutes />} />
      </Routes>
    </Router>
  );
}
