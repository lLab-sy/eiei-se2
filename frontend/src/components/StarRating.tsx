'use client'
import { useState } from "react";
import { Star } from "lucide-react";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

const StarRating = ({ value, onChange }:{value:number,onChange: (...event: any[]) => void}) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  return (
    <FormItem>
      <FormLabel>Rating Score</FormLabel>
      <FormControl>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="p-1 focus:outline-none"
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => onChange(star)}
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hoveredRating || value)
                    ? "fill-mainyellow text-mainyellow"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default StarRating;