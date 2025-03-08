import React from "react";

type RadioOption = {
  label: string;
  id: string;
};

type RadioInputProps = {
  radioOptions: RadioOption[];
  register: any;
  label: string;
  name: string;
  errors: any;
};
export default function RadioInput({
  radioOptions,
  register,
  label,
  name,
  errors,
}: RadioInputProps) {
  return (
    <div className="grid gap-3 pt-4">
      <h3 className=" font-semibold text-gray-900 dark:text-white">{label}</h3>
      <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        {radioOptions.map((item, i) => {
          return (
            <li
              key={i}
              className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
            >
              <div className="flex items-center ps-3">
                <input
                  {...register(`${name}`, { required: true })}
                  name={`${name}`}
                  id={item.id}
                  type="radio"
                  value={item.id}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                />
                <label
                  htmlFor={item.id}
                  className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  {item.label}
                </label>
              </div>
            </li>
          );
        })}
      </ul>
      {errors[`${name}`] && (
        <span className="text-red-600  text-sm">{label} is required</span>
      )}
    </div>
  );
}
