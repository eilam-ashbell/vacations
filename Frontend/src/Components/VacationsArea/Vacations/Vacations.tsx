import { useEffect, useState } from "react";
import vacationsService from "../../../Services/VacationsService";
import VacationCard from "../VacationCard/VacationCard";
import "./Vacations.css";
import Pagination from '@mui/material/Pagination';
import VacationForUserModel from "../../../Models/vacationForUserModel";
import jwtDecode from "jwt-decode";
import { AuthAction, AuthActionType, authStore } from "../../../Redux/AuthState";
import UserModel from "../../../Models/userModel";
import { vacationsStore } from "../../../Redux/VacationsState";
import { useBadge } from "@mui/base";
import config from "../../../Utils/Config";
import { useNavigate } from "react-router-dom";


function Vacations(): JSX.Element {

    const navigate = useNavigate()
    const pageSize = config.numOfVacationsOnPage
    const [vacations, setVacations] = useState<VacationForUserModel[]>([])
    const [vacationsToDisplay, setVacationsToDisplay] = useState<VacationForUserModel[]>([])
    const [pagination, setPagination] = useState({
        count: 0,
        from: 0,
        to: pageSize
    })

    // Get all vacation for specific user on load
    useEffect(() => {
        if (!authStore.getState().token) navigate("/login")
        // Extract user object from token
        const container: { user: UserModel } = jwtDecode(authStore.getState().token)
        const user = container.user
        // Get vacation for this user

        vacationsService.getAllVacations(user.userUuid).then(result => {
            // Set results in local state
            setVacations(result)
        }).catch( err => {
            const action: AuthAction = {
                type: AuthActionType.Logout
            }
            authStore.dispatch(action)
            navigate("/login")
        })
    }, [])

    useEffect(() => {

        // Define how many vacations there are in the state
        const vacationsLength = vacations.length

        // Define which vacation to display
        const vacationsOnPage = vacations.slice(pagination.from, pagination.to)

        // Set vacation count in state
        setPagination({ ...pagination, count: vacationsLength })

        // Set relevant vacation to display
        setVacationsToDisplay(vacationsOnPage)

        // If vacation store changed > repeat functionality
        const unsubscribe = vacationsStore.subscribe(() => {
            setVacations(vacationsStore.getState().vacations)
            const vacationsLength = vacations.length
            const vacationsOnPage = vacations.slice(pagination.from, pagination.to)
            setPagination({ ...pagination, count: vacationsLength })
            setVacationsToDisplay(vacationsOnPage)
        })

        // Unsubscribe from vacation store
        return () => unsubscribe()

        // Repeat functionality each time local states are change
    }, [vacations, pagination.from, pagination.to])

    // Handle page change on pagination
    function handlePageChange(event: React.ChangeEvent<unknown>, page: number): void {
        const from = (page - 1) * pageSize;
        const to = (page - 1) * pageSize + pageSize;
        setPagination({ ...pagination, from: from, to: to })
    }

    return (
        <div className="Vacations">
            <div className="vacations-align">
                <div className="vacations-wrapper">
                    {
                        vacationsToDisplay.map(v =>
                            <VacationCard key={v.vacationId} vacationData={v} />
                        )
                    }
                </div>
            </div>
            <div className="pagination-wrapper">
                <Pagination
                    count={Math.ceil(vacations.length / pageSize)}
                    onChange={handlePageChange}
                />
            </div>
        </div>
    );
}

export default Vacations;
