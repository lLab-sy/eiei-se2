import { searchReqDTO } from "../dtos/userDTO";
import cloudService from "../services/cloudService";
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
    async getUser(req: Request, res: Response): Promise<void> {
        try{
            const username = req.params.username;
            if(!username){
                sendResponse(res, 'error', 'Cannot Find Username')
                return;
            }
            const getUser = await userService.getUser(username)
            sendResponse(res, 'success', getUser, "Successfully get User")
        }catch(err){
            console.log(err)
            sendResponse(res, 'error', 'Failed to get User')
        }
    }
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
        }catch(err : any){
            console.log(err)
            sendResponse(res, 'error', err?.message ?? "Failed to update user")
        }
    }
    async uploadProfileImage(req : Request, res : Response) : Promise<void> {
        try{
            const profileImage = req?.file;
            const id = req.params.id
            if(!profileImage){
                sendResponse(res, 'error', "Failed to find Image")
                return;
            }
            const user = await userService.getUserById(id)
            console.log('user', user)
            const buffer = profileImage?.buffer
            const mimetype = profileImage?.mimetype
            const imageKey = (user?.profileImage && user?.profileImage !== '') ? user?.profileImage : cloudService.getKeyName()
            console.log('imageKey',imageKey)
            const returnData = await cloudService.uploadImageToGetURLWithDeleteCondition(buffer!, mimetype!, imageKey, id)
            
            sendResponse(res, 'success', returnData, "Successfully Upload Image")
        }catch(err : any){
            console.log(err)
            sendResponse(res, 'error', err?.message ?? "Failed to upload profile")
        }
    }
    async getSignedURL(req : Request, res: Response) : Promise<void> {
        try{
            const id = req.params.id
            if(!id){
                sendResponse(res, 'error', "Failed to find Id")
            }
            const user = await userService.getUserById(id)
            // console.log(user)
            if(!user){
                sendResponse(res, 'error', 'Failed to Find User')
            }
            
            const key = user?.profileImage ?? ""
            const url = await cloudService.getSignedUrlImageCloud(key)
            sendResponse(res, 'success', url, "Successfully Find Image Key")

            // const returnSignedURL = await cloudService.getSignedUrlImageCloud()
        }catch(err : any){
            sendResponse(res, 'error', err?.message ?? "Failed to get signed url")

        }
    }
    async search(req: Request, res: Response): Promise<void>  {
        try {
            const minExperience = req.query.minExperience ? Number(req.query.minExperience): undefined
            const maxExperience = req.query.maxExperience ? Number(req.query.maxExperience): undefined
            const minRating = req.query.minRating ? Number(req.query.minRating): undefined
            const limit = req.query.limit ? Number(req.query.limit): 10
            const page = req.query.page ? Number(req.query.page): 1

            if (limit < 1 || page < 1) {
                sendResponse(res, 'error', '', 'bad request', 400);
                return
            }

            const searchParams: searchReqDTO = {
                searchText: req.query.searchText as string,
                minExperience: minExperience,
                maxExperience: maxExperience,
                minRating: minRating,
                limit: limit,
                page: page,
            }

            const result = await userService.searchProductionProfessional(searchParams);

            if (result.meta.totalPages < page) {
                sendResponse(res, 'error', '', 'bad request', 400);
                return
            }

            sendResponse(res, 'success', result)
        } catch (error) {
            sendResponse(res, 'error', error)
        }
    }
}


export default new UserController()