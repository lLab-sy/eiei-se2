'use client'
import { FormItem, FormLabel, FormControl, FormMessage, FormField } from "@/components/ui/form";
import { Textarea } from "./ui/textarea";
import { UseFormReturn } from "react-hook-form";


const ReviewComment = ({ form } : {form:UseFormReturn<{
    comment: string;
    rating: number;
    production: string;
}, any, undefined>}) => {
    return (
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Review</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your experience working with this professional..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
    );
  };
  
  export default ReviewComment;