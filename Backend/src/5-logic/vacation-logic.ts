import { OkPacket } from "mysql";
import dal from "../2-utils/dal";
import {
    ClientError,
    IdNotFoundError,
    ValidationError,
} from "../4-models/client-errors";
import VacationFollowersModel from "../4-models/vacation-followers-model";
import VacationModel from "../4-models/vacation-model";
import { v4 as uuid } from "uuid";
import safeDelete from "../2-utils/safe-delete";
import config from "../2-utils/config";
import FollowerModel from "../4-models/follower-model";

// GET all vacation for a specific user with followers data
async function getAllVacationsForUser(
    userUuid: string
): Promise<VacationFollowersModel[]> {
    const sql =
        "SELECT DISTINCT V.*, EXISTS(SELECT * FROM followers WHERE vacationId = F.vacationId AND userId = (SELECT userId FROM users WHERE userUuid = ?)) AS isFollowing, COUNT(F.userId) AS followersCount FROM vacations as V LEFT JOIN followers as F ON V.vacationId = F.vacationId GROUP BY vacationId ORDER BY startDate ASC";
    const vacations = await dal.execute(sql, [userUuid]);
    return vacations;
}

// GET a vacation data
async function getVacation(vacationId: number): Promise<VacationModel> {
    const sql = "SELECT * FROM vacations WHERE vacationId = ?";
    const vacation = await dal.execute(sql, [vacationId]);
    return vacation;
}

// Add a vacation
async function addVacation(vacation: VacationModel): Promise<VacationModel> {
    // Validate vacation data
    const error = vacation.validate();
    if (error) throw new ValidationError(error);

    // Handle image
    if (vacation.image) {
        const extension = vacation.image.name.substring(
            vacation.image.name.lastIndexOf(".")
        ); // Extract image extension
        vacation.imageName = uuid() + extension; // Save new image name in vacation object
        await vacation.image.mv(config.imagesFolderPath + vacation.imageName); // Move image to images folder
        delete vacation.image; // Delete image before saving
    }

    // Add to DB
    const sql = "INSERT INTO vacations VALUES(DEFAULT, ?, ?, ?, ?, ?, ?)";
    const result: OkPacket = await dal.execute(sql, [
        vacation.destination,
        vacation.description,
        vacation.imageName,
        vacation.startDate,
        vacation.endDate,
        vacation.price,
    ]);
    vacation.vacationId = result.insertId;
    return vacation;
}

// Update a vacation
async function updateVacation(vacation: VacationModel): Promise<VacationModel> {
    // Validate
    const error = vacation.validate();
    if (error) throw new ValidationError(error);

    // Handle image
    if (vacation.image) {       
        await safeDelete(config.imagesFolderPath + vacation.imageName); // Delete the previous image
        const extension = vacation.image.name.substring(
            vacation.image.name.lastIndexOf(".")
        ); // Extract image extension
        vacation.imageName = uuid() + extension;
        await vacation.image.mv(config.imagesFolderPath + vacation.imageName); // Move image to images folder
        delete vacation.image; // Delete image before saving
    }
    const sql =
        "UPDATE vacations SET destination = ?, description = ?, imageName = ?, startDate = ?, endDate = ?, price = ? WHERE vacations.vacationId = ?";
    const result: OkPacket = await dal.execute(sql, [
        vacation.destination,
        vacation.description,
        vacation.imageName,
        vacation.startDate,
        vacation.endDate,
        vacation.price,
        vacation.vacationId,
    ]);
    if (result.affectedRows === 0)
        throw new IdNotFoundError(vacation.vacationId);
    return vacation;
}

// Delete a vacation
async function deleteVacation(vacationId: number): Promise<void> {
    // Find image name of the desired vacation in the DB
    const findImageName =
        "SELECT imageName FROM vacations WHERE vacationId = ?";
    const imageNameResult = await dal.execute(findImageName, [vacationId]);
    // Extract the image name from the result
    const imageNameToDelete = imageNameResult[0].imageName;
    // Delete image from HD
    await safeDelete(config.imagesFolderPath + imageNameToDelete); // Delete the previous image
    // Delete vacation from DB
    const sql = "DELETE FROM vacations WHERE vacationId = ?";
    const result: OkPacket = await dal.execute(sql, [vacationId]);
    if (result.affectedRows === 0) throw new IdNotFoundError(vacationId);
}

// Assign follow for a vacation
async function followVacation(
    vacationId: number,
    userUuid: string
): Promise<FollowerModel> {
    const sql =
        "INSERT INTO followers VALUES ((SELECT userId FROM users WHERE userUuid = ?), ? )";
    await dal.execute(sql, [
        userUuid,
        vacationId,
        userUuid,
        vacationId,
    ]);
    const follower = new FollowerModel({"userUuid": userUuid, "vacationId": vacationId});
    return follower;
}

// Assign un-follow for a vacation
async function unFollowVacation(
    vacationId: number,
    userUuid: string
): Promise<void> {
    const sql =
        "DELETE FROM followers WHERE (userId = (SELECT userId FROM users WHERE userUuid = ?) AND vacationId = ? )";
    const result: OkPacket = await dal.execute(sql, [userUuid, vacationId]);
    if (result.affectedRows === 0)
        throw new ClientError(404, "following not found");
}

// GET vacations data for report
async function getVacationsDataToReport(): Promise<VacationFollowersModel[]> {
    const sql =
        "SELECT V.vacationId, V.destination, COUNT(F.userId) AS followersCount FROM vacations as V LEFT JOIN followers as F ON V.vacationId = F.vacationId GROUP BY vacationId";
    const vacationsData = await dal.execute(sql, []);
    return vacationsData;
}

export default {
    getAllVacationsForUser,
    getVacation,
    addVacation,
    updateVacation,
    deleteVacation,
    followVacation,
    unFollowVacation,
    getVacationsDataToReport,
};
