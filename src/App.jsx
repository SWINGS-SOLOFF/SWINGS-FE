import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartPage from "./pages/StartPage";
import Home from "./pages/Home";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/swings/startpage" element={<StartPage />} />
        <Route
          path="/swings/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
};

export default App;
