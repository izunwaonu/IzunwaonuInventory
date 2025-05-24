import DataTable from "@/components/DataTableComponents/DataTable";
import { columns } from "./columns";
import ModalTableHeader from "@/components/dashboard/Tables/ModalTableHeader";;
import { getAuthenticatedUser } from "@/config/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import  UnitForm  from "@/components/Forms/inventory/UnitForm";
import { getOrgUnit } from "@/actions/units";
import BrandForm from "@/components/Forms/inventory/BrandForm";
import { getOrgBrand } from "@/actions/brands";
import { Suspense } from "react";
import TableLoading from "@/components/ui/data-table/table-loading";

export default async function page() {
  
  const user = await getAuthenticatedUser();
  const orgId = user.orgId;
  const orgName = user?.orgName??"";
  const brands = (await getOrgBrand(orgId)) || [];
  
  return (
   
    <div className="p-8">
          <Suspense fallback={<TableLoading title="Item Inventory" />}>
            <ModalTableHeader
                title="Brands"
                linkTitle="Add Brand"
                href="#"
                data={brands}
                model="brand"
                modalForm={<BrandForm orgId={orgId}/>}
              />
              <DataTable columns={columns} data={brands} />  
          </Suspense>
         
    </div>
    
  );
}
