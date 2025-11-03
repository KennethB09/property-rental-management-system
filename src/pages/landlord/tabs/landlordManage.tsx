import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";
import { Plus } from "lucide-react";

export default function LandlordManage() {
    return (
        <div>
            <header>Manage</header>
            <div>
                <div>
                    <div><Button><Plus /> Add</Button></div>
                    <Select>
                       
                            <SelectItem value="all"/>
                       
                    </Select>
                </div>
                <div>
                    {}
                </div>
            </div>
        </div>
    )
}