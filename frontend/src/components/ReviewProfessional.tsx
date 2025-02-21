"use client";
import { Button, Rating } from "@mui/material";
import { ScrollArea } from "./ui/scroll-area";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import ReviewContent from "./ReviewContent";
import { Star } from "lucide-react";
import { Progress } from "./ui/progress";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
// npx shadcn@latest add progress


interface ratingCounterInterface {
  [key : string] : number
}


// const allSum: number = calculateAllSum(ratingCounter) ?? 0;



interface reviewDataInterface {
  amount: number;
  rating: number;
  reviews: Array<reviewInterface>;
}
export interface reviewInterface {
  comment: string;
  postName: string;
  producer: string;
  reviewAt: string;
  role: string;
  producerProfileImage : string;
}
export default function ReviewProfessional({ id }: { id: string }) {
  const [previewReviewRating, setPreviewReviewRating] = useState<number>(0)
  const [previewReview, setPreviewReview] = useState<reviewInterface>({
    comment: "",
    postName : "",
    producer : "",
    reviewAt : "",
    role : "",
    producerProfileImage : "",
  })
  const [reviewData, setReviewData] = useState<Array<reviewDataInterface>>([]);
  const [showReview, setShowReview] = useState<Array<reviewInterface>>([]);
  const [ratingState, setRatingState] = useState<number>(5)
  let ratingCounter : ratingCounterInterface = {
    "5": 0,
    "4": 0,
    "3": 0,
    "2": 0,
    "1": 0,
  }
  const calculateAllSum = (reviewData : Array<reviewDataInterface>) => {
    let sum = 0
    for(const reviewObject of reviewData){
      ratingCounter[reviewObject?.rating?.toString()] = reviewObject.amount
      sum += reviewObject.amount
    }
    if(sum === 0) return 0;
    return sum
  };
  const allSum = calculateAllSum(reviewData)
  console.log("allSum", allSum)
  const calculateAvgRating = (ratingCounter : ratingCounterInterface) => {
    const avg =
      (ratingCounter["5"] * 5 +
        ratingCounter["4"] * 4 +
        ratingCounter["3"] * 3 +
        ratingCounter["2"] * 2 +
        ratingCounter["1"]) /
      allSum;
    return Math.round(avg * 10) / 10;
  };
  const avg = calculateAvgRating(ratingCounter);
  const calculatePercentage = (ratingCounter: object) => {
    
    return Object.fromEntries(
      Object.entries(ratingCounter).map(([key, value]) => [
        key,
        Math.round((value / allSum) * 10000) / 100,
      ]),
    );
  };
  const percentageRating = calculatePercentage(ratingCounter);
  console.log("percentage", percentageRating);
  const {data : session, status} = useSession()
  useEffect(() => {
    if(!session){
      return;
    }
    const fetchReviews = async (id: string) => {
      const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/users/reviews/${id}`;

      const reviewResponse = await axios.get(apiUrl);
      // const reviewData = await reviewResponse.data
      console.log("ReviewResponse", reviewResponse);
      const newReviewData = reviewResponse?.data?.data
      setReviewData(newReviewData ?? []);
      for(const reviewObject of newReviewData){
        if(reviewObject.reviews.length > 0){
          console.log('reviewObject', reviewObject)
          setPreviewReview(reviewObject.reviews[0])
          setPreviewReviewRating(reviewObject.rating)
          break;
        }
      }
    };
    fetchReviews(id);

  }, []);
  console.log('previewReview', previewReview)
  console.log("reviewData", reviewData);
  
  const groupOnClick = (rating: number) => {
    setRatingState(rating)
    for (const review of reviewData) {
      if (review.rating === rating) {
        setShowReview(review.reviews)
        break;
      }
      setShowReview([])
    }
  };
  
  return (
    <Dialog>
      <DialogTrigger
        asChild
        className="h-30 w-full rounded-md border border-black overflow-hidden"
      >
        <Button
          onClick={() => groupOnClick(5)}
          variant="outlined"
          className="bg-gray-400 text-left border border-black overflow-hidden"
        >
          {/* <ReviewContent data={mockReviews[0] ?? ""}/> */}
          {/* <span>Your Review</span> */}
          {
            (previewReviewRating === 0) ? "No Review" : <ReviewContent rating={previewReviewRating} data={previewReview}/>
          }
            
          {/* {reviewData.length > 0 ? <ReviewContent rating={rating} data={showReview[0]} /> : "No Review"} */}
        </Button>
      </DialogTrigger>
      <DialogContent

        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        className="bg-mainblue border-mainblue border  overflow-y-auto scroll-p-0 h-[70%] flex flex-col"
      >
        <DialogTitle className="text-2xl bg-mainblue text-white h-[5%]">Your Review</DialogTitle>
        <div className="flex px-3 py-2 my-1 bg-white rounded-lg border justify-around items-center">
          <div className=" w-[30%] items-center flex flex-col">
            {/* <Star size={90} color="#ffbb00" strokeWidth={3} /> */}
            <span className="text-5xl">{(avg) ? avg : 0}</span>
            <span className="text-lg">Out of 5</span>
            <Rating value={avg} readOnly />
          </div>
          <div className="  w-[60%] flex flex-col">
            <span className="flex items-center">
              5 <Rating size="medium" className="" max={1} value={1} readOnly />
              <Progress
                className="w-[60%] mx-4"
                value={percentageRating["5"]}
              />
              <span className="text-xs">{ratingCounter["5"]}</span>
            </span>
            <span className="flex items-center">
              4 <Rating size="medium" className="" max={1} value={1} readOnly />
              <Progress
                className="w-[60%] mx-4"
                value={percentageRating["4"]}
              />
              <span className="text-xs">{ratingCounter["4"]}</span>
            </span>
            <span className="flex items-center">
              3 <Rating size="medium" className="" max={1} value={1} readOnly />
              <Progress
                className="w-[60%] mx-4"
                value={percentageRating["3"]}
              />
              <span className="text-xs">{ratingCounter["3"]}</span>
            </span>
            <span className="flex items-center">
              2 <Rating size="medium" className="" max={1} value={1} readOnly />
              <Progress
                className="w-[60%] mx-4"
                value={percentageRating["2"]}
              />
              <span className="text-xs">{ratingCounter["2"]}</span>
            </span>
            <span className="flex items-center">
              1 <Rating size="medium" className="" max={1} value={1} readOnly />
              <Progress
                className="w-[60%] mx-4"
                value={percentageRating["1"]}
              />
              <span className="text-xs">{ratingCounter["1"]}</span>
            </span>
          </div>
        </div>
        <div className="flex justify-around">
          <span onClick={() => groupOnClick(5)} className={`${ratingState == 5 ? "bg-white" : "bg-slate-300"} hover:bg-white flex cursor-pointer justify-center rounded-lg w-[9%] h-[30px] items-center`}>
            5 <Rating size="medium" className="" max={1} value={1} readOnly />
          </span>
          <span onClick={() => groupOnClick(4)} className={`${ratingState == 4 ? "bg-white" : "bg-slate-300"} hover:bg-white flex cursor-pointer justify-center rounded-lg w-[9%] h-[30px] items-center`}>
            4 <Rating size="medium"  className="" max={1} value={1} readOnly />
          </span>
          <span onClick={() => groupOnClick(3)} className={`${ratingState == 3 ? "bg-white" : "bg-slate-300"} hover:bg-white flex cursor-pointer justify-center rounded-lg w-[9%] h-[30px] items-center`}>
            3 <Rating size="medium" className="" max={1} value={1} readOnly />
          </span>
          <span onClick={() => groupOnClick(2)} className={`${ratingState == 2 ? "bg-white" : "bg-slate-300"} hover:bg-white flex cursor-pointer justify-center rounded-lg w-[9%] h-[30px] items-center`}>
            2 <Rating size="medium" className="" max={1} value={1} readOnly />
          </span>
          <span onClick={() => groupOnClick(1)} className={`${ratingState == 1 ? "bg-white" : "bg-slate-300"} hover:bg-white flex cursor-pointer justify-center rounded-lg w-[9%] h-[30px] items-center`}>
            1 <Rating size="medium"  className="" max={1} value={1} readOnly />
          </span>
        </div>
        <div className={`flex flex-col items-center ${(showReview.length > 0) ? "" : "justify-center"} bg-slate-200 rounded-2xl h-full`}>
          {
            (showReview.length > 0) ? 
            showReview.map((review, index) => <ReviewContent key={index} rating={ratingState} data={review}/>)
            : <div className='text-mainblue text-3xl'>No Review</div>
          }
        </div>
      </DialogContent>
    </Dialog>
  );
}
