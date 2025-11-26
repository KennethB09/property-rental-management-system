import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter } from "lucide-react";
import { toast } from "sonner";
import type { listing, ratingAndReviews } from "@/types/interface";
import ListingItem from "@/components/tenantUi/listingItem";
import ListingDetails from "@/components/tenantUi/listingDetails";
import { getFilters } from "@/hooks/useFetchData";
import { Link } from "react-router";

export default function TenantSearch() {
  const { filters: property_type } = getFilters();
  const [results, setResults] = useState<listing[] | []>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<listing & ratingAndReviews>();
  const [openModal, setOpenModal] = useState(false);
  const [filters, setFilters] = useState({
    searchQuery: "",
    minPrice: "",
    maxPrice: "",
    propertyType: "",
    maxTenant: "",
  });

  const handleApplyFilters = async () => {
    setIsLoading(true);

    const params = new URLSearchParams();
    if (filters.searchQuery) params.append("searchQuery", filters.searchQuery);
    if (filters.minPrice) params.append("minPrice", filters.minPrice);
    if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
    if (filters.propertyType)
      params.append("propertyType", filters.propertyType);
    if (filters.maxTenant) params.append("maxTenant", filters.maxTenant);

    // Fetch listings with filters
    const listings = await fetch(
      `${
        import.meta.env.VITE_SERVER_URL
      }/rent-ease/api/search-property?${params}`
    );

    const json = await listings.json();

    if (!listings.ok) {
      setIsLoading(false);
      return toast.error("Can't get listings.");
    }
    console.log(json);
    setIsLoading(false);
    setResults(json);
  };

  function handleSelectedListing(param: listing & ratingAndReviews) {
    setSelected(param);
    setOpenModal(true);
  }

  return (
    <div className="dark:bg-gray-950 p-4 font-roboto flex flex-col h-screen">
      {openModal && selected && (
        <ListingDetails
          details={selected}
          open={openModal}
          setOpen={setOpenModal}
        />
      )}
      <div className="flex gap-3 items-center">
        <Link to={"/tenant/dashboard"}>
          <ArrowLeft size={30} className="text-green-700" />
        </Link>

        <Input
          placeholder="Search properties..."
          value={filters.searchQuery}
          onChange={(e) =>
            setFilters({ ...filters, searchQuery: e.target.value })
          }
          onKeyDown={(e) =>
            e.key === "Enter" && !e.shiftKey && handleApplyFilters()
          }
          disabled={isLoading}
          className="flex-1 max-w-2xl ml-auto p-5 rounded-2xl dark:border-none dark:bg-slate-900"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="cursor-pointer rounded-2xl p-5 dark:border-none dark:bg-slate-900">
              <Filter size={20} className="text-green-700" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 dark:border-none dark:bg-slate-900">
            <DropdownMenuLabel className="text-gray-900 dark:text-slate-100 font-semibold">
              Filter Options
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Min Price */}
            <div className="px-2 py-2">
              <label className="text-sm text-gray-900 dark:text-slate-100 font-semibold">
                Min Price
              </label>
              <Input
                type="number"
                placeholder="Min price"
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters({ ...filters, minPrice: e.target.value })
                }
                className="mt-1 h-8"
              />
            </div>

            {/* Max Price */}
            <div className="px-2 py-2">
              <label className="text-sm text-gray-900 dark:text-slate-100 font-semibold">
                Max Price
              </label>
              <Input
                type="number"
                placeholder="Max price"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters({ ...filters, maxPrice: e.target.value })
                }
                className="mt-1 h-8"
              />
            </div>

            {/* Property Type */}
            <div className="px-2 py-2">
              <label className="text-sm text-gray-900 dark:text-slate-100 font-semibold">
                Property Type
              </label>
              <select
                value={filters.propertyType}
                onChange={(e) =>
                  setFilters({ ...filters, propertyType: e.target.value })
                }
                className="w-full mt-1 h-8 px-2 rounded-[10px] border text-sm dark:bg-slate-900"
              >
                <option value="">Select type</option>
                {property_type.map((item) => (
                  <option key={item.id} value={item.id.toString()}>{item.name}</option>
                ))}
              </select>
            </div>

            {/* Max Tenant */}
            <div className="px-2 py-2">
              <label className="text-sm text-gray-900 dark:text-slate-100 font-semibold">
                Max Tenant
              </label>
              <Input
                type="number"
                placeholder="Max tenants"
                value={filters.maxTenant}
                onChange={(e) =>
                  setFilters({ ...filters, maxTenant: e.target.value })
                }
                className="mt-1 h-8"
              />
            </div>

            <DropdownMenuSeparator />
            <div className="px-2 py-2 flex gap-2">
              <Button
                className="text-gray-900 dark:text-slate-100"
                size="sm"
                variant="outline"
                onClick={() =>
                  setFilters({
                    searchQuery: "",
                    minPrice: "",
                    maxPrice: "",
                    propertyType: "",
                    maxTenant: "",
                  })
                }
              >
                Clear
              </Button>
              <Button size="sm" className="bg-green-700 hover:bg-green-800 text-slate-100" onClick={handleApplyFilters}>
                Apply
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-wrap overflow-y-auto h-screen gap-2 p-4 w-full">
        {results.map((item) => (
          <ListingItem key={item.id} property={item} onClick={handleSelectedListing} />
        ))}
      </div>
    </div>
  );
}
