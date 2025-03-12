// 3. src/components/ProfessionalSelector.tsx
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface Professional {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface ProfessionalSelectorProps {
  professionals: Professional[];
  selectedProfessionalId: string | null;
  onSelect: (id: string) => void;
}

export default function ProfessionalSelector({
  professionals,
  selectedProfessionalId,
  onSelect,
}: ProfessionalSelectorProps) {
  return (
    <div>
      <label className="text-sm text-gray-500 mb-1 block">
        Select a Production Professional
      </label>
      <div className="flex overflow-x-auto py-2 gap-2">
        {professionals.map((prof) => (
          <button
            key={prof.id}
            onClick={() => onSelect(prof.id)}
            className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-colors ${
              selectedProfessionalId === prof.id
                ? "bg-blue-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={prof.avatar} alt={prof.name} />
              <AvatarFallback>{prof.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start text-sm">
              <span>{prof.name}</span>
              <span
                className={`text-xs ${selectedProfessionalId === prof.id ? "text-gray-200" : "text-gray-500"}`}
              >
                {prof.role}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
