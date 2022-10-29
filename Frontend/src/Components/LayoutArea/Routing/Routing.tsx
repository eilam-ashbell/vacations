import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { authStore } from "../../../Redux/AuthState";
import Login from "../../AuthArea/Login/Login";
import Logout from "../../AuthArea/Logout/Logout";
import Register from "../../AuthArea/Register/Register";
import RequireAuth from "../../AuthArea/RequireAuth/RequireAuth";
import AddVacation from "../../VacationsArea/AddVacation/AddVacation";
import EditVacation from "../../VacationsArea/EditVacation/EditVacation";
import Report from "../../VacationsArea/Report/Report";
import Vacations from "../../VacationsArea/Vacations/Vacations";
import PageNotFound from "../PageNotFound/PageNotFound";
import "./Routing.css";

function Routing(): JSX.Element {

    const [isAuth, setIsAuth] = useState<string>()

    useEffect(() => {
        setIsAuth(authStore.getState().token)
    }, [])

    return (
        <div className="Routing">
            <Routes>

                {/* Vacations page */}
                <Route path="/" element={<Navigate to="/home" />} />                
                <Route path="/home" element={<RequireAuth children={<Vacations />} />} />

                {/* Edit vacation form for admin */}
                <Route path="/edit/:vacationId" element={<RequireAuth children={<EditVacation />} />} />

                {/* Add vacation form for admin */}
                <Route path="/add" element={<RequireAuth children={<AddVacation />} />} />

                {/* Vacation report for admin */}
                <Route path="/report" element={<RequireAuth children={<Report />} />} />

                {/* Register */}
                <Route path="/register" element={<Register />} />

                {/* Login */}
                <Route path="/login" element={<Login />} />

                {/* Logout */}
                <Route path="/logout" element={<Logout />} />

                {/* 404 page */}
                <Route path="*" element={<PageNotFound />} />

            </Routes>
        </div>
    );
}

export default Routing;
