import { FieldValues, UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"; // Adjust import paths accordingly
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // Adjust import paths accordingly

interface ReviewProfessionalListProps {
  form: UseFormReturn<{ comment: string; rating: number; production: string; }, any, undefined>;
  productionList: { label: string; value: string }[];
}

const ReviewProfessionalList = ({
  form,
  productionList,
}:ReviewProfessionalListProps) => {
  return (
    <FormField
      control={form.control}
      name="production"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Production Professional</FormLabel>

          {/*SELECT W/ DIALOG STILL BUGGED IN FIREFOX
          AUTOFOCUS WILL CREATE INFINITE RECURSION 
          other browsers works fine*/}
          
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select one" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {productionList.map((prof) => (
                <SelectItem key={prof.value} value={prof.value}>
                  {prof.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ReviewProfessionalList;