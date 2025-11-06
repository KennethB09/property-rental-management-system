import AddProperty from "@/components/landlordUi/manage/addProperty";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function LandlordManage() {
    const [openAddForm, setOpenAddForm] = useState(false);

  return (
    <div className="flex flex-col font-roboto p-4 h-full">
        {openAddForm && <AddProperty setClose={setOpenAddForm}/>}
      <header className="mb-4">
        <h1 className="font-bold text-3xl text-gray-900">Manage</h1>
      </header>
      <div className="border-2 border-gray-400 rounded-[10px] h-full p-3">
        <div className="flex justify-between ">
          <div className="text-white">
            <Button className="bg-green-700" onClick={() => setOpenAddForm(prev => !prev)}>
              Add <Plus />
            </Button>
          </div>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {}
            </SelectContent>
          </Select>
        </div>
        <div>{}</div>
      </div>
    </div>
  );
}
