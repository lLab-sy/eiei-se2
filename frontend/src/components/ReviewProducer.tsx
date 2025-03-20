"use client";
import { Rating } from "@mui/material";
import ReviewContent from "./ReviewContent";
import { Progress } from "./ui/progress";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import getReviewProfesstional from "@/libs/getReviewProfesstional";
import { ReceivedReview, ReceivedReviews } from "../../interface";
import ReviewProducerContent from "./ReviewProducerContent";
// npx shadcn@latest add progress

export default function ReviewProducer({ id }: { id: string }) {
  
  const [reviewData, setReviewData] = useState< Map<number, ReceivedReview[]> >(new Map());
  const [showReview, setShowReview] = useState<ReceivedReview[]>([]);
  const [ratingState, setRatingState] = useState<number>(0);
  const [allReviews, setAllReviews] = useState<ReceivedReview[]>([]);
  const {data : session, status} = useSession();

  //Overall Info
  const [avg, setAvg] = useState(0.0);
  const [percentageRating, setPercentageRating] = useState<Map<number, number>>(new Map());

  function calculateOverall() {
    // calculate sum and precent;
    let sum = 0;
    let newPerentRating = new Map();
    for(let i = 1; i <= 5; ++i){
        let reviews = reviewData.get(i) || [];
        sum += reviews.length * i;
        newPerentRating.set(i,allReviews.length == 0 ? 0 : reviews.length / allReviews.length * 100);
    }
    setPercentageRating(newPerentRating);

    // calculate avg;
    if(allReviews.length != 0) setAvg(Math.round( sum / allReviews.length * 10)  / 10 );
  }

  useEffect(() => {
    if(!session){
      return;
    }
    const fetchReviews = async (id: string) => {
        const reviewResponse = await getReviewProfesstional(id);
        const receivedReviews = reviewResponse?.receivedReviews || [];
        setAllReviews(receivedReviews);

        let newReviewData = new Map();
        receivedReviews.forEach(review => {
            const rating = review.ratingScore;

            let receivedReviews : ReceivedReview[] = newReviewData.get(rating) || [];
            receivedReviews.push(review);
            newReviewData.set(rating, receivedReviews);
            
        });
        setReviewData(newReviewData);
    };
    fetchReviews(id);
  }, []);

  console.log("reviewData", reviewData);
  console.log('allReview', allReviews)
  const groupOnClick = (rating: number) => {
    setRatingState(rating);
    if(rating === 0){
      setShowReview(allReviews)
      return;
    }
    const toshow = reviewData.get(rating) || [];
    setShowReview(toshow)  
  };

  useEffect(() => {
    groupOnClick(0);
  }, [allReviews]);

  useEffect(() => {
    calculateOverall();
  }, [reviewData])

  return (
      <div
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        className=" h-full overflow-y-auto scroll-p-0 flex flex-col"
      >
        <title className="text-2xl bg-mainblue text-white h-[5%]">Your Review</title>
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
                value={percentageRating.get(5)}
              />
              <span className="text-xs">{(reviewData.get(5) || []).length}</span>
            </span>
            <span className="flex items-center">
              4 <Rating size="medium" className="" max={1} value={1} readOnly />
              <Progress
                className="w-[60%] mx-4"
                value={percentageRating.get(4)}
              />
              <span className="text-xs">{(reviewData.get(4) || []).length}</span>
            </span>
            <span className="flex items-center">
              3 <Rating size="medium" className="" max={1} value={1} readOnly />
              <Progress
                className="w-[60%] mx-4"
                value={percentageRating.get(3)}
              />
              <span className="text-xs">{(reviewData.get(3) || []).length}</span>
            </span>
            <span className="flex items-center">
              2 <Rating size="medium" className="" max={1} value={1} readOnly />
              <Progress
                className="w-[60%] mx-4"
                value={percentageRating.get(2)}
              />
              <span className="text-xs">{(reviewData.get(2) || []).length}</span>
            </span>
            <span className="flex items-center">
              1 <Rating size="medium" className="" max={1} value={1} readOnly />
              <Progress
                className="w-[60%] mx-4"
                value={percentageRating.get(1)}
              />
              <span className="text-xs">{(reviewData.get(1) || []).length}</span>
            </span>
          </div>
        </div>
        <div className="mt-5 flex justify-around after:content-[''] relative after:absolute after:w-[90%] after:h-[5px] after:bg-slate-200 after:translate-y-[28.5px] ">
          <span onClick={() => groupOnClick(0)} className={`${ratingState == 0 ? "after:w-[100%]  z-10" : "after:bg-slate-200 after:w-[100%]"} relative after:absolute after:translate-y-4 after:content-['']  after:h-[5px] after:rounded-md after:bg-mainblue hover:bg-white flex cursor-pointer justify-center rounded-lg w-[9%] h-[30px] items-center`}>
            All 
          </span>
          <span onClick={() => groupOnClick(5)} className={`${ratingState == 5 ? "after:w-[100%] z-10" : "after:bg-slate-200 after:w-[100%]"} relative after:absolute after:translate-y-4 after:content-['']  after:h-[5px] after:rounded-md after:bg-mainblue hover:bg-white flex cursor-pointer justify-center rounded-lg w-[9%] h-[30px] items-center`}>
            5 
          </span>
          <span onClick={() => groupOnClick(4)} className={`${ratingState == 4 ? "after:w-[100%] z-10" : "after:bg-slate-200 after:w-[100%]"} relative after:absolute after:translate-y-4 after:content-['']  after:h-[5px] after:rounded-md after:bg-mainblue hover:bg-white flex cursor-pointer justify-center rounded-lg w-[9%] h-[30px] items-center`}>
            4 
          </span>
          <span onClick={() => groupOnClick(3)} className={`${ratingState == 3 ? "after:w-[100%] z-10" : "after:bg-slate-200 after:w-[100%]"} relative after:absolute after:translate-y-4 after:content-['']  after:h-[5px] after:rounded-md after:bg-mainblue hover:bg-white flex cursor-pointer justify-center rounded-lg w-[9%] h-[30px] items-center`}>
            3 
          </span>
          <span onClick={() => groupOnClick(2)} className={`${ratingState == 2 ? "after:w-[100%] z-10" : "after:bg-slate-200 after:w-[100%]"} relative after:absolute after:translate-y-4 after:content-['']  after:h-[5px] after:rounded-md after:bg-mainblue hover:bg-white flex cursor-pointer justify-center rounded-lg w-[9%] h-[30px] items-center`}>
            2 
          </span>
          <span onClick={() => groupOnClick(1)} className={`${ratingState == 1 ? "after:w-[100%] z-10" : "after:bg-slate-200 after:w-[100%]"} relative after:absolute after:translate-y-4 after:content-['']  after:h-[5px] after:rounded-md after:bg-mainblue hover:bg-white flex cursor-pointer justify-center rounded-lg w-[9%] h-[30px] items-center`}>
            1 
          </span>
        </div>

        <div className={`mt-5 flex flex-col items-center ${(showReview.length > 0) ? "" : "justify-center"} rounded-2xl h-full`}>
          {
            (showReview.length > 0) ? 
            showReview.map((review, index) => <ReviewProducerContent key={index} rating={(ratingState === 0) ? review.ratingScore ?? 0 : ratingState} data={review}/>)
            : <div className='text-mainblue text-3xl'>No Review</div>
          }
        </div>
      </div>
  );
}

