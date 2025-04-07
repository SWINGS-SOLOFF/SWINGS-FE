import { Route, Routes } from "react-router-dom";
import NotificationPage from "../pages/NotificationPage.jsx";

export default function NotificationRoutes() {
    return (
            <Routes>
                <Route path="" element={<NotificationPage />} />
            </Routes>
    );
}
