import { ProducerDto } from "../dtos/producerDTO";
import { ProductionProfessionalDtO, RatingDTO } from "../dtos/productionProfessionalDTO";
import { IProducer, Rating, searchReqModel } from "../models/userModel"
import { IProductionProfessional } from "../models/userModel"
import ProducerRespository from '../repositories/producerRepository';
import ProductionProfessionalRespository from "../repositories/productionProfessionalRespository";
import { searchReqDTO, reviewDTO, reviewWithRatingDTO, ReceivedReviewDTO, ReceivedReviewsDTO} from "../dtos/userDTO";
import { PaginatedResponseDTO, PaginationMetaDTO } from "../dtos/utilsDTO";
import userRepository from "../repositories/userRepository";
import postRepository from "../repositories/postRepository";
import { PostDTO } from "../dtos/postDTO";
import { IPost } from "../models/postModel";
import cloudService from "./cloudService";

class UserService {
    async getUser(username:string){
        try{
            const getUser = await userRepository.findUserByUsername(username)
            
            return getUser
        }catch(err){
            console.error("Error in service layer:", err);
            throw new Error("Error in service layer: " + (err as Error).message);
        }
    }
    async getUserById(id:string){
        try{

            const getUser = await userRepository.getUserByID(id)
            
            return getUser
        }catch(err){
            console.error("Error in service layer:", err);
            throw new Error("Error in service layer: " + (err as Error).message);
        }
    }
    async updateProducer(producerDTO: ProducerDto, id: string) {
        try {
            // const hashedPassword = await bcrypt.hash(producerDTO.password, 10)
            // const producerObject = { ...producerDTO, password: hashedPassword};

            const res = await ProducerRespository.updateProducer(producerDTO as IProducer, id);
            return res;
        } catch (error) {
            console.error("Error in service layer:", error);
            throw new Error("Error in service layer: " + (error as Error).message);
        }
    }

    async updateProductionProfessional(productionDTO: ProductionProfessionalDtO, id: string) {
        try {
        //     const hashedPassword = await bcrypt.hash(productionDTO.password, 10)
        //     const professionalObject = { ...productionDTO, password:hashedPassword };
            const res = await ProductionProfessionalRespository.updateProductionProfessional(productionDTO as IProductionProfessional, id);
            return res;
        } catch (error) {
            console.error("Error updating Production Professional:", error);
            throw new Error("Error in service layer: " + (error as Error).message);
        }
    }

    async searchProductionProfessional(searchReq: searchReqDTO): Promise<PaginatedResponseDTO<ProductionProfessionalDtO>> {
        try {
            const searchModel: searchReqModel = searchReq
            const results = await ProductionProfessionalRespository.searchProductionProfessional(searchModel)
            const response: PaginatedResponseDTO<ProductionProfessionalDtO> = {
                data: results.data,
                meta: {
                    page: searchModel.page,
                    limit: searchModel.limit,
                    totalItems: results.totalItems,
                    totalPages: Math.ceil(results.totalItems / searchModel.limit)
                } as PaginationMetaDTO
            }
            return response;
        } catch (error) {
            throw new Error("Error in service layer when search Production Professional: " + (error as Error).message);
        }
    }

    async getUserReviewsById(id: string) {
        try {
            const userReviews = await userRepository.getUserReviewsByID(id);
    
            const result = await Promise.all(
                userReviews.map(async (r) => {
                    return new reviewWithRatingDTO({
                        rating: r._id as number,
                        amount: r.amount as number,
                        reviews: await Promise.all(
                            r.reviews.map(async (review: reviewDTO) => {
                                let producerProfileImage = review.producerProfileImage
                                    ? await cloudService.getSignedUrlImageCloud(review.producerProfileImage)
                                    : '';
                                console.log('reviewProducerProfileImage', review.producerProfileImage)
                                console.log('producerProfileImage', producerProfileImage)
                                return new reviewDTO({
                                    postName: review.postName as string,
                                    producer: review.producer as string,
                                    producerProfileImage: producerProfileImage,
                                    role: review.role as string,
                                    comment: review.comment as string,
                                    reviewAt: review.reviewAt as Date
                                });
                            })
                        ),
                    });
                })
            );
    
            return result;
        } catch (error) {
            console.error("Error fetching user reviews:", error);
            throw error;
        }
    }
    
    async addProductionProfessionalReview(id: string, newReviewDTO: RatingDTO): Promise<ProductionProfessionalDtO> {
        try {
            // check post status

            if (newReviewDTO.postID == undefined) {
                throw new Error("Error in service layer when add Review to Production Professional : postID is 'undefined'");
            }

            const post: IPost = await postRepository.getPost(newReviewDTO.postID.toString())
            if (post.postStatus != "success"){
                throw new Error("Error in service layer when add Review to Production Professional : postStatus not 'success'");
            }

            const ratingModel: Rating = newReviewDTO


            const results = await ProductionProfessionalRespository.addProductionProfessionalReview(id, ratingModel)
            return results;
        } catch (error) {
            throw new Error("Error in service layer when add Review to Production Professional: " + (error as Error).message);
        }
    }

    async getUserReceivedReviewsByID(id:string){
        try{
            const userReceivedReviews = await userRepository.getUserReceivedReviewsByID(id);
            
            const result = await Promise.all(
                userReceivedReviews.map(async (r) => {
                    return new ReceivedReviewsDTO({
                        receivedReviews: await Promise.all(
                            r.reviews.map(async (review: ReceivedReviewDTO) => {
                                let reviewerProfileImageTmp = (typeof review.reviewerProfileImage === 'string' && review.reviewerProfileImage != "")
                                    ? await cloudService.getSignedUrlImageCloud(review.reviewerProfileImage)
                                    : '';
                                return new ReceivedReviewDTO({
                                    reviewerName: review.reviewerName as string,
                                    reviewerProfileImage: reviewerProfileImageTmp,
                                    ratingScore: review.ratingScore,
                                    comment: review.comment as string
                                })
                            })
                        )
                    })
                })
            )

            console.log(result);
            return result;
        }catch(error){
            console.error("Error service layer fetching user received reviews", error);
            throw error;
        }
    }
}

export default new UserService();