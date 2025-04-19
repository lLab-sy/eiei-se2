import { ObjectId } from 'mongodb';
import { User } from '../models/userModel';
import Transaction from '../models/transactionModel';
import Post from '../models/postModel';

class TransactionRepository {
    async getTransactions(userID: string){
        const userId = new ObjectId(userID);

        const user = await User.findById(userId);
        if(!user){
            throw new Error("User not found.")
        }

        const transaction = await Transaction.find({userId}).sort({createdAt:-1}).populate('userId').populate('postId')
        return transaction
    }

    async getProfessionalTransactions(userID: string){
        const userId = new ObjectId(userID);

        const user = await User.findById(userId);
        if(!user){
            throw new Error("User not found.")
        }

        const posts = await Post.aggregate([
          {
            $match: {
              postStatus: "success",
              participants: {
                $elemMatch: {
                  participantID: userId,
                  status: "candidate"
                }
              }
            }
          },
          {
            $lookup: {
              from: "transactions",
              let: {
                postId: "$_id"
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ["$postId", "$$postId"]
                        },
                        {
                          $eq: [
                            "$userId",userId
                          ]
                        }
                      ]
                    }
                  }
                }
              ],
              as: "matchedTransactions"
            }
          },
          {
            $addFields: {
              isTransferable: {
                $cond: [
                  {
                    $gt: [
                      {
                        $size: "$matchedTransactions"
                      },
                      0
                    ]
                  },
                  false,
                  true
                ]
              }
            }
          },
          {
            $project: {
              matchedTransactions: 0,
              postDescription: 0,
              postImages: 0,
              postMediaType: 0,
              postProjectRoles: 0,
              postStatus: 0,
              startDate: 0,
              createdAt: 0,
              updatedAt: 0,
              __v: 0
            }
          },
          {
            $unwind: "$participants"
          },
          {
            $match: {
              "participants.participantID": userId
            }
          },
          {
            $project: {
              participantID:
                "$participants.participantID",
              offer: "$participants.offer",
              postName: 1,
              endDate: 1,
              isTransferable: 1
            }
          }
        ]);
        return posts;
    }
}

export default new TransactionRepository();