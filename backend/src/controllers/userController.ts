import userService from "../services/userService";
import { sendResponse } from "../utils/responseHelper";
import { Request, Response } from 'express';

function validatePassword(password: string): boolean {
    // Regex for checking if the password contains at least one special character
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>+-]/;
  
    if (!specialCharRegex.test(password)) {
      return false;
    }
  
    // You can add additional checks here (like length, etc.)
    return true;
}
class UserController {
    
    async updateUser(req: Request, res: Response): Promise<void> {
        try {
            
            const userData = req.body;
            if((userData.password && userData.password.length < 8)){
                sendResponse(res, 'error', 'Password Length should be more than 8')
                return;
            }
            //eiei
            if(userData.password && !validatePassword(userData.password)){
                sendResponse(res, 'error', 'password should contain at least one special character')
                return;
            }
            const role = userData.role
            const id = req.params.id

            if (!role || !id) {
                sendResponse(res, 'error', 'Missing required fields: role or id');
                return;
            }

            const updatedUser = (role === 'producer') ? await userService.updateProducer(userData, id) : await userService.updateProductionProfessional(userData, id)
            if(!updatedUser){
                sendResponse(res, 'error', 'Failed to update User updated User')
                return;
            }

            sendResponse(res, 'success', updatedUser, 'Successfully updated User')
        }catch(err){
            console.log(err)
            sendResponse(res, 'error', 'Failed to update User')
        }
    }
}


export default new UserController()