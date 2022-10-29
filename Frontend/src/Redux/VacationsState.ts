import { createStore } from "redux";
import VacationForUserModel from "../Models/vacationForUserModel";
export class VacationsState {
    public vacations: VacationForUserModel[] = []; // Our global data.
}

export enum VacationsActionType {
    FetchVacations = "FetchVacations", // Fetch all vacations from backend
    AddVacation = "AddVacation", // Add new vacation
    UpdateVacation = "UpdateVacation", // Update existing vacation
    DeleteVacation = "DeleteVacation" // Delete existing vacation
}
export interface VacationsAction {
    type: VacationsActionType; // Which operation we're going to do
    payload: any; // Which data we're sending
}

export function vacationsReducer(currentState = new VacationsState(), action: VacationsAction): VacationsState {

    const newState = { ...currentState };

    // Do the change on the newState: 
    switch (action.type) {

        case VacationsActionType.FetchVacations: // payload = all vacations fetched from the server
            newState.vacations = action.payload; // Set all fetched vacations to the state
            break;

        case VacationsActionType.AddVacation: // payload = vacation to add
            newState.vacations.push(action.payload); // Add the new vacation to the state
            break;

        case VacationsActionType.UpdateVacation: // payload = vacation to update
            const indexToUpdate = newState.vacations.findIndex(v => v.vacationId === action.payload.vacationId); // -1 if not exist
            if (indexToUpdate >= 0) {
                newState.vacations[indexToUpdate] = action.payload; // Update
            }
            break;

        case VacationsActionType.DeleteVacation: // payload = id to delete
            const indexToDelete = newState.vacations.findIndex(v => v.vacationId === action.payload); // -1 if not exist
            if (indexToDelete >= 0) {
                newState.vacations.splice(indexToDelete, 1); // Delete
            }
            break;
    }

    return newState; // return the new state
}

export const vacationsStore = createStore(vacationsReducer);

