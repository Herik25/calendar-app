import { ErrorMessage } from "formik";
import React from "react";

function CustomInput({
  field,
  form: { touched, errors },
  label,
  required,
  placeholder,
  ...props
}) {

  const isInvalid = !!touched[field.name] && !!errors[field.name];
  return (
    <div className="flex flex-col gap-1 bg-slate-200 w-full py-1 px-4 border-b-[1px] border-b-black rounded-tl-md rounded-tr-md">
      <h5 className="text-xs">
        {label}
        {required && <span className="text-[#D34053]">*</span>}
      </h5>
      <input
        {...field}
        {...props}
        placeholder={placeholder}
        invalid={isInvalid ? "true" : "false"}
        className="w-full  bg-slate-200 focus:border-none focus:outline-none text-sm"
      />
      <ErrorMessage
        name={field.name}
        component="div"
        className="text-[#D34053] text-sm sm:text-base"
      />
    </div>
  );
}

export default CustomInput;
