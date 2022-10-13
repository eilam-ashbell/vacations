import config from "../../../Utils/Config";
import FollowBtn from "../FollowBtn/FollowBtn";
import "./VacationCard.css";
import VacationForUserModel from "../../../Models/vacationForUserModel";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { authStore } from "../../../Redux/AuthState";
import vacationsService from "../../../Services/VacationsService";
import { useNavigate } from "react-router-dom";
import EventIcon from '@mui/icons-material/Event';
import { useState } from "react";
interface VacationCardProps {
    vacationData: VacationForUserModel;
}

function formatDate(date: string): string {
    const dateObj = new Date(date)
    const formattedDate = dateObj.toLocaleDateString("he-IL");
    return formattedDate
}

function VacationCard(props: VacationCardProps): JSX.Element {

    const navigate = useNavigate()
    const bgImageStyle = {
        backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(255, 255, 255, 0)80%), url(${config.serverStaticsImages + props.vacationData.imageName})`
    }
    const [open, setOpen] = useState<boolean>(false);

    const adminBtnStyle = {
        backgroundColor: "white",
        color: "var(--Neutral-700)",
        boxShadow: "none",
        fontSize: 12,
        textTransform: "capitalize",
        fontFamily: 'roboto',
        borderRadius: "100px",
        '&:hover': {
            backgroundColor: 'var(--Prime-700)',
            color: '#fff',
            borderColor: '#0062cc',
            boxShadow: 'none',
        },
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirm = () => {
        vacationsService.deleteVacation(props.vacationData.vacationId)
        setOpen(false);
    };

    const adminBtnIconsStyle = {
        width: "14px",
        transform: "translateY(-1px)"
    }

    return (
        <div className="VacationCard">
            <div
                className="bg-image"
                style={bgImageStyle}
            >
                {
                    authStore.getState().user.roleId !== 1 &&
                    <FollowBtn vacation={props.vacationData} />
                }
                {
                    authStore.getState().user.roleId === 1 &&
                    <div className="admin-wrapper">
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<DeleteIcon sx={adminBtnIconsStyle} />}
                            sx={adminBtnStyle}
                            onClick={handleClickOpen}>
                            Delete
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<EditIcon fontSize="small" sx={adminBtnIconsStyle} />}
                            sx={adminBtnStyle}
                            onClick={() => navigate('/edit/' + props.vacationData.vacationId)}
                        >
                            Edit
                        </Button>
                        <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                                {"Are you sure you want do DELETE?"}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    {`By pressing DELETE you are confirm delete vacation to '${props.vacationData.destination}' between ${new Date(props.vacationData.startDate).toLocaleDateString()} - ${new Date(props.vacationData.endDate).toLocaleDateString()}`} 
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose}>Cancel</Button>
                                <Button onClick={handleConfirm} autoFocus>
                                    Delete
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                }
                <h3>{props.vacationData.destination}</h3>
            </div>
            <div className="dates-wrapper">
                <EventIcon sx={{ fontSize: 18 }} />
                <span className="vacation-dates">
                    <span className="from-date">{formatDate(props.vacationData.startDate)
                        + " - " +
                        formatDate(props.vacationData.endDate)}
                    </span>
                </span>
                <div className="cards-placeholder"></div>
            </div>
            <div className="card-body">
                <p className="vacation-description">{props.vacationData.description}
                </p>
                <h4>${props.vacationData.price}</h4>
            </div>
        </div>
    );
}

export default VacationCard;
