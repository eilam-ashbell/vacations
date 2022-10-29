import { NextFunction, Request, Response } from "express";
import auth from "../2-utils/auth";
import { ForbiddenError, UnauthorizedError } from "../4-models/client-errors";

async function verifyAdmin(request: Request, response: Response, next: NextFunction ): Promise<void> {

    // extract authorization header's value
    const authHeader = request.header("authorization");

    // verify token
    const isValid = await auth.verifyToken(authHeader);

    // if token not valid
    if (!isValid) {
        next(new UnauthorizedError("You are not logged in")); // catch all middleware
        return;
    }

    // extract role of user
    const role = auth.getUserRoleIdFromToken(authHeader);

    if (role !== 1) {
        next(new ForbiddenError("You are not an admin"))
        return
    }

    // if token is valid
    next(); // continue
}

export default verifyAdmin;
