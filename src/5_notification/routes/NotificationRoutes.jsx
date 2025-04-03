import { Route, Routes } from "react-router-dom";
import NotificationPage from "../pages/NotificationPage.jsx";
import { NotificationProvider } from "../context/NotificationContext.jsx";

export default function NotificationRoutes() {
    return (
            <Routes>
                <Route path="" element={<NotificationPage />} />
            </Routes>
    );
}
