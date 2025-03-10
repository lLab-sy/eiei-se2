// 5. src/components/ComparisonView.tsx
import { CircleCheck, CircleX, Clock9 } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface Professional {
  professionalId: string;
  professionalName: string;
  professionalAvatar: string;
  offerId: string;
  price: number;
  reason: string;
  status: string;
  date: string;
  isLatestOffer: boolean;
}

interface RoleBasedOffer {
  role: string;
  professionals: Professional[];
}

interface ComparisonViewProps {
  roleBasedOffers: RoleBasedOffer[];
  onAccept: (offerId: string) => void;
  onReject: (offerId: string) => void;
}

export default function ComparisonView({
  roleBasedOffers,
  onAccept,
  onReject,
}: ComparisonViewProps) {
  // ตัวช่วยแสดงสถานะ
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "candidate":
        return <Clock9 className="h-5 w-5 text-yellow-500" />;
      case "in-progress":
        return <CircleCheck className="h-5 w-5 text-green-500" />;
      case "reject":
        return <CircleX className="h-5 w-5 text-red-500" />;
      default:
        return <Clock9 className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-bold mb-4">เปรียบเทียบข้อเสนอ</h3>
      <div className="w-full max-h-[560px] overflow-auto">
        {roleBasedOffers.map((roleOffer, index) => (
          <div key={index} className="mb-6 border rounded-lg overflow-hidden">
            <div className="bg-gray-100 p-3 font-semibold text-lg border-b">
              {roleOffer.role}
            </div>
            <div className="p-3">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2">ผู้สมัคร</th>
                      <th className="p-2">ราคา</th>
                      <th className="p-2">รายละเอียด</th>
                      <th className="p-2">สถานะ</th>
                      <th className="p-2">การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roleOffer.professionals.map((prof, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={prof.professionalAvatar}
                                alt={prof.professionalName}
                              />
                              <AvatarFallback>
                                {prof.professionalName.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{prof.professionalName}</span>
                          </div>
                        </td>
                        <td className="p-2 font-semibold">
                          {prof.price.toLocaleString()} บาท
                        </td>
                        <td
                          className="p-2 max-w-[200px] truncate"
                          title={prof.reason}
                        >
                          {prof.reason}
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-1">
                            {getStatusIcon(prof.status)}
                            <span>
                              {prof.status === "candidate"
                                ? "รอพิจารณา"
                                : prof.status === "in-progress"
                                  ? "ตอบรับแล้ว"
                                  : "ปฏิเสธแล้ว"}
                            </span>
                          </div>
                        </td>
                        <td className="p-2">
                          {prof.status === "candidate" && (
                            <div className="flex gap-2">
                              <Button
                                onClick={() => onAccept(prof.offerId)}
                                className="bg-green-500 hover:bg-green-600 text-white"
                                size="sm"
                              >
                                ตอบรับ
                              </Button>
                              <Button
                                onClick={() => onReject(prof.offerId)}
                                className="bg-red-500 hover:bg-red-600 text-white"
                                size="sm"
                              >
                                ปฏิเสธ
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
