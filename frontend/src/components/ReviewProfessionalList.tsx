import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface ReviewProfessionalListProps {
  form: UseFormReturn<
    { comment: string; rating: number; production: string },
    any,
    undefined
  >;
  productionList: { label: string; value: string }[];
}

const ReviewProfessionalList = ({
  form,
  productionList,
}: ReviewProfessionalListProps) => {
  // กำหนดค่าเริ่มต้นถ้ามีรายการใน productionList แต่ยังไม่มีค่าที่เลือก
  useEffect(() => {
    if (productionList?.length > 0 && !form.getValues("production")) {
      form.setValue("production", productionList[0].value);
    }
  }, [productionList, form]);

  // console.log("***************")

  // ฟังก์ชันหา label จาก value
  const getSelectedLabel = () => {
    const selectedValue = form.getValues("production");
    const selected = productionList?.find(
      (item) => item.value === selectedValue,
    );
    return selected?.label;
  };

  return (
    <FormField
      control={form.control}
      name="production"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel>Production Professional</FormLabel>
          <Select
            value={field.value}
            onValueChange={(value) => {
              console.log("Selected Value:", value); // Debug log
              field.onChange(value);
            }}
          >
            <FormControl>
              <SelectTrigger className="transition-all duration-300 hover:bg-blue-50 hover:border-mainblue hover:text-mainblue">
                <SelectValue placeholder="Select a professional">
                  {getSelectedLabel() || "Select a professional"}
                </SelectValue>
              </SelectTrigger>
            </FormControl>
            <SelectContent className="max-h-80 overflow-y-auto">
              {productionList?.length > 0 ? (
                productionList.map((prof) => (
                  <SelectItem
                    key={prof.value}
                    value={prof.value}
                    className="transition-colors cursor-pointer hover:bg-blue-50 hover:text-mainblue"
                  >
                    {prof.label}
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-center text-gray-500">
                  No professionals available
                </div>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ReviewProfessionalList;