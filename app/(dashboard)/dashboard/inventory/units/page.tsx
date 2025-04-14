import DataTable from "@/components/DataTableComponents/DataTable";
import { columns } from "./columns";
import ModalTableHeader from "@/components/dashboard/Tables/ModalTableHeader";;
import { getAuthenticatedUser } from "@/config/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import  UnitForm  from "@/components/Forms/inventory/UnitForm";
import { getOrgUnit } from "@/actions/units";

export default async function page() {
  
  const user = await getAuthenticatedUser();
  const orgId = user.orgId;

  const units = (await getOrgUnit(orgId)) || [];
  
  return (
   
    <div className="p-8">
         <ModalTableHeader
                title="Unit"
                linkTitle="Add Unit"
                href="#"
                data={units}
                model="unit"
                modalForm={<UnitForm orgId={orgId}/>}
              />
              <DataTable columns={columns} data={units} />
    </div>
    
  );
}
