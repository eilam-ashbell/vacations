import axios from "axios";
import FollowerModel from "../Models/followerModel";
import VacationForUserModel from "../Models/vacationForUserModel";
import VacationModel from "../Models/vacationModel";
import {
    VacationsAction,
    VacationsActionType,
    vacationsStore,
} from "../Redux/VacationsState";
import config from "../Utils/Config";

class VacationService {
    public async getAllVacations(
        userUuid: string
    ): Promise<VacationForUserModel[]> {
        let vacations = vacationsStore.getState().vacations;
        if (vacations.length === 0) {
            const response = await axios.get<VacationForUserModel[]>(
                config.routes.getAllVacations + userUuid
            );
            vacations = response.data;
            const action: VacationsAction = {
                payload: vacations,
                type: VacationsActionType.FetchVacations,
            };
            vacationsStore.dispatch(action);
        }
        return vacations;
    }

    public async getVacation(vacationId: number): Promise<VacationModel> {
        const response = await axios.get<VacationModel[]>(
            config.routes.getVacation + vacationId
        );
        const vacations = response.data;
        const vacation: VacationModel = vacations[0];
        return vacation;
    }

    public async addFollower(
        userUuid: string,
        vacation: VacationForUserModel
    ): Promise<FollowerModel> {
        const follower = new FollowerModel({
            userUuid: userUuid,
            vacationId: vacation.vacationId,
        });
        const response = await axios.post<FollowerModel>(
            config.routes.addFollower,
            follower
        );
        const addedFollower = response.data;
        vacation.followersCount++;
        vacation.isFollowing = 1;
        const action: VacationsAction = {
            type: VacationsActionType.UpdateVacation,
            payload: vacation,
        };
        vacationsStore.dispatch(action);
        return addedFollower;
    }

    public async removeFollower(
        userUuid: string,
        vacation: VacationForUserModel
    ): Promise<void> {
        const follower = new FollowerModel({
            userUuid: userUuid,
            vacationId: vacation.vacationId,
        });
        await axios.delete<void>(config.routes.removeFollower, {
            data: follower,
        });
        // const removedFollower = response.data;
        vacation.followersCount--;
        vacation.isFollowing = 0;
        const action: VacationsAction = {
            type: VacationsActionType.UpdateVacation,
            payload: vacation,
        };
        vacationsStore.dispatch(action);
        // return removedFollower;
    }

    public async deleteVacation(vacationId: number): Promise<void> {
        await axios.delete(config.routes.deleteVacation + vacationId);

        // Delete vacation from global state
        const action: VacationsAction = {
            type: VacationsActionType.DeleteVacation,
            payload: vacationId,
        };
        vacationsStore.dispatch(action);
    }

    public async updateVacation(
        vacation: VacationModel
    ): Promise<void> {
        const formData = new FormData();
        formData.append("destination", vacation.destination)
        formData.append("description", vacation.description)
        formData.append("startDate", vacation.startDate)
        formData.append("endDate", vacation.endDate)
        formData.append("price", vacation.price.toString())
        formData.append("image", vacation.image[0])
        formData.append("imageName", vacation.imageName)

        const response = await axios.put<VacationModel>(
            config.routes.updateVacation + vacation.vacationId, formData
        );
        const updatedVacation = response.data;

        const action: VacationsAction = {
            type: VacationsActionType.UpdateVacation,
            payload: updatedVacation
        }
        vacationsStore.dispatch(action)
    }

    public async addVacation(
        vacation: VacationModel
    ): Promise<void> {
        const formData = new FormData();
        formData.append("destination", vacation.destination)
        formData.append("description", vacation.description)
        formData.append("startDate", vacation.startDate)
        formData.append("endDate", vacation.endDate)
        formData.append("price", vacation.price.toString())
        formData.append("image", vacation.image[0])
        // formData.append("imageName", vacation.imageName)

        const response = await axios.post<VacationModel>(
            config.routes.addVacation, formData
        );
        const addedVacation = response.data;

        const action: VacationsAction = {
            type: VacationsActionType.AddVacation,
            payload: addedVacation
        }
        vacationsStore.dispatch(action)
    }
}

const vacationsService = new VacationService();

export default vacationsService;
