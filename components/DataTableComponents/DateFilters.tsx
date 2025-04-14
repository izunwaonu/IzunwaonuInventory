"use client";
import {
  filterByLast7Days,
  filterByThisMonth,
  filterByThisYear,
  filterByToday,
  filterByYesterday,
} from "@/lib/dateFilters";
import React, { useState } from "react";
import Select from "react-tailwindcss-select";
import { SelectValue } from "react-tailwindcss-select/dist/components/type";

export default function DateFilters({
  data,
  onFilter,
  setIsSearch,
}: {
  data: any[];
  onFilter: any;
  setIsSearch: any;
}) {
  const options = [
    { value: "life", label: "Life time" },
    { value: "today", label: "Today" },
    { value: "last-7-days", label: "Last 7 days" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This year" },
  ];
  const [selectedFilter, setSelectedFilter] = useState<SelectValue>(options[0]);
  const handleChange = (item: any) => {
    const valueString = item!.value;
    setSelectedFilter(item);
    setIsSearch(false);
    if (valueString === "life") {
      onFilter(data);
    } else if (valueString === "today") {
      const filteredData = filterByToday(data);
      onFilter(filteredData);
    } else if (valueString === "yesterday") {
      const filteredData = filterByYesterday(data);
      onFilter(filteredData);
    } else if (valueString === "last-7-days") {
      const filteredData = filterByLast7Days(data);
      onFilter(filteredData);
    } else if (valueString === "month") {
      const filteredData = filterByThisMonth(data);
      onFilter(filteredData);
    } else if (valueString === "year") {
      const filteredData = filterByThisYear(data);
      onFilter(filteredData);
    }
    console.log("value:", valueString);
    // setAnimal(value);
    // onFilter(filteredData);
  };
  return (
    <div>
      <Select
        value={selectedFilter}
        onChange={handleChange}
        options={options}
        primaryColor={"indigo"}
      />
    </div>
  );
}



// "use client";

// import React, { useState } from "react";
// import Select from "react-tailwindcss-select";
// import { SelectValue } from "react-tailwindcss-select/dist/components/type";
// import { months } from "../Forms/SavingForm";

// export default function DateFilters({
//   data,
//   onFilter,
//   setIsSearch,
// }: {
//   data: any[];
//   onFilter: any;
//   setIsSearch: any;
// }) {
//   const [selectedFilter, setSelectedFilter] = useState<SelectValue>(null);
//   const filterByMonth = (data: any[], key: string): any[] => {
//     return data.filter((item) => item.month === key);
//   };
//   const handleChange = (item: any) => {
//     const valueString = item!.value;
//     setSelectedFilter(item);
//     setIsSearch(false);
//     const filteredData = filterByMonth(data, valueString);
//     onFilter(filteredData);
//   };
//   return (
//     <div className="w-full">
//       <Select
//         value={selectedFilter}
//         onChange={handleChange}
//         options={months}
//         primaryColor={"indigo"}
//         isSearchable
//         placeholder="Filter By Month"
//       />
//     </div>
//   );
// }
