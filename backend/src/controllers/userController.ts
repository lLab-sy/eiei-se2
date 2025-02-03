import userService from "../services/userService";
import { sendResponse } from "../utils/responseHelper";
import { Request, Response } from 'express';
class UserController {
    async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const userData = req.body;
            const role = userData.role
            const id = req.params.id

            if (!role || !id) {
                sendResponse(res, 'error', 'Missing required fields: role or id');
            }

            const updatedUser = (role === 'producer') ? await userService.updateProducer(userData, id) : await userService.updateProductionProfessional(userData, id)
            if(!updatedUser){
                sendResponse(res, 'error', 'Failed to update User')
            }

            sendResponse(res, 'success', updatedUser, 'Successfully updated User')
        }catch(err){
            sendResponse(res, 'error', 'Failed to update User')
        }
    }
}


export default new UserController()