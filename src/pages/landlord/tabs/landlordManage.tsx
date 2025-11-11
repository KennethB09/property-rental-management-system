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
import { usePropertyContext } from "@/hooks/usePropertyContext";
import Item from "@/components/landlordUi/manage/item";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import PropertyInfo from "@/components/landlordUi/manage/propertyInfo";
import type { TProperty } from "@/types/appData";

export default function LandlordManage() {
  const { properties } = usePropertyContext();
  const [openAddForm, setOpenAddForm] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<TProperty | null>(null)

  function handleModalClick(data: TProperty) {
    setActiveModal(data)
    setModalOpen(true);
  }

  return (
    <div className="flex flex-col font-roboto p-4 h-full">
      {modalOpen && activeModal && <PropertyInfo setClose={setModalOpen} property={activeModal} />}

      {openAddForm && <AddProperty setClose={setOpenAddForm} />}
      <header className="mb-4">
        <h1 className="font-bold text-3xl text-gray-900">Manage</h1>
      </header>
      <div className="border-2 border-gray-400 rounded-[10px] h-full p-3">
        <div className="flex justify-between ">
          <div className="text-white">
            <Button
              className="bg-green-700"
              onClick={() => setOpenAddForm((prev) => !prev)}
            >
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
        <div className="mt-2">
          {properties?.length !== 0 ? (
            properties?.map((property) => <Item key={property.id} property={property} onClick={handleModalClick}/>)
          ) : (
            <h1>No Listings</h1>
          )}
        </div>
      </div>
    </div>
  );
}
