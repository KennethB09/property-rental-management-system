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
import PropertyInfo from "@/components/landlordUi/manage/propertyInfo";
import type { TProperty } from "@/types/appData";
import { Tabs, TabsTrigger, TabsContent, TabsList } from "@/components/ui/tabs";
import Request from "@/components/landlordUi/manage/request";
import Tenants from "@/components/landlordUi/manage/tenants";

export default function LandlordManage() {
  const { properties } = usePropertyContext();
  const [openAddForm, setOpenAddForm] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<TProperty | null>(null);

  function handleModalClick(data: TProperty) {
    setActiveModal(data);
    setModalOpen(true);
  }

  return (
    <div className="flex flex-col font-roboto p-4 h-full lg:w-[91%]">

      {activeModal && <PropertyInfo setClose={setModalOpen} property={activeModal} open={modalOpen}/>}

      <AddProperty setClose={setOpenAddForm} open={openAddForm} />

      <header className="mb-4">
        <h1 className="font-bold text-3xl text-gray-900 dark:text-slate-100">Manage</h1>
      </header>

      <Tabs defaultValue="properties" className="overflow-y-hidden h-full">
        <TabsList className="dark:bg-gray-800">
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="Requests">Requests</TabsTrigger>
          <TabsTrigger value="Tenants">Tenants</TabsTrigger>
        </TabsList>
        <TabsContent value="properties" className="h-full">
          <div className="flex flex-col border border-gray-300 rounded-2xl h-full p-3">
            <div className="flex justify-between">
              <div className="text-white">
                <Button
                  className="bg-green-700 hover:bg-green-900 text-slate-100"
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
            <div className="mt-2 pb-12 h-full w-full flex items-start justify-center overflow-y-auto">

            <div className="flex w-full flex-col-reverse gap-1">
              {properties?.length !== 0 ? (
                properties?.map((property) => (
                  <Item
                    key={property.id}
                    property={property}
                    onClick={handleModalClick}
                  />
                ))
              ) : (
                <h1>No Listings</h1>
              )}
            </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="Requests" className="h-full overflow-y-auto">
          <Request />
        </TabsContent>
        <TabsContent value="Tenants">
          <Tenants />
        </TabsContent>
      </Tabs>
    </div>
  );
}
