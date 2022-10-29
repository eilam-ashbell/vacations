import { useEffect, useState } from "react";
import vacationsService from "../../../Services/VacationsService";
import VacationCard from "../VacationCard/VacationCard";
import "./Vacations.css";
import Pagination from '@mui/material/Pagination';
import VacationForUserModel from "../../../Models/vacationForUserModel";
import jwtDecode from "jwt-decode";
import { authStore } from "../../../Redux/AuthState";
import UserModel from "../../../Models/userModel";
import { vacationsStore } from "../../../Redux/VacationsState";
import config from "../../../Utils/Config";
import { useNavigate } from "react-router-dom";
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import notifyService from "../../../Services/NotifyService";
import LeaderboardIcon from '@mui/icons-material/Leaderboard';

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
    const [isFiltered, setIsFiltered] = useState<boolean>(false)

    // Get all vacation for specific user on load
    useEffect(() => {
        

        // Extract user object from token
        const container: { user: UserModel } = jwtDecode(authStore.getState().token)
        const user = container.user

        if (!isFiltered) {

            // Get vacation for this user
            vacationsService.getAllVacations(user.userUuid)
                .then(result => {

                    // Set results in local state
                    setVacations(result)

                }).catch(err => {
                    notifyService.error(err)
                    if (err.response?.data === "You are not logged in"){
                        navigate("/logout")
                    }
                })
        } else {
            setVacations(vacations.filter(v => v.isFollowing === 1))
        }
    }, [isFiltered])

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
            <div className="action-nav">
                {
                    authStore.getState().user.roleId !== 1 &&
                <button
                className={isFiltered ? "active" : ""}
                onClick={() => isFiltered ? setIsFiltered(false) : setIsFiltered(true)}
                >
                    <FavoriteIcon sx={{ color: "inherent", fontSize: 16, marginRight: "8px" }}
                    />
                    My Vacations
                </button>
                }
                {authStore.getState().user.roleId === 1 &&
                    <div className="admin-functions">
                        <button onClick={() => navigate('/add')}>
                            <AddIcon sx={{ color: "inherent", fontSize: 16, marginRight: "8px" }} />
                            Add Vacation
                        </button>
                        <button onClick={() => navigate('/report')}>
                            <LeaderboardIcon sx={{ color: "inherent", fontSize: 16, marginRight: "8px" }} />
                            View Report
                        </button>
                    </div>
                }
            </div>
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
