// 2. src/components/RoleDropdown.tsx
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface RoleDropdownProps {
  selectedRole: string;
  availableRoles: string[];
  onSelectRole: (role: string) => void;
}

export default function RoleDropdown({
  selectedRole,
  availableRoles,
  onSelectRole,
}: RoleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectRole = (role: string) => {
    onSelectRole(role);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="text-sm text-gray-500 mb-1 block">
        เลือกตำแหน่งงาน
      </label>
      <div
        className="border p-2 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedRole || "เลือกตำแหน่งงาน"}</span>
        <ChevronDown size={16} />
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 border rounded-lg bg-white z-10 shadow-lg">
          {availableRoles.map((role) => (
            <div
              key={role}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectRole(role)}
            >
              {role}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
