import React from "react";
import PropTypes from "prop-types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Textarea,
} from "../ui";
import { cn } from "@/lib/utils";

const FormTextarea = ({
  form,
  lable,
  name,
  type = "text",
  placeholder,
  className,
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {lable && <FormLabel>{lable}</FormLabel>}
          <FormControl>
            <Textarea
              placeholder={placeholder}
              {...field}
              type={type}
              className={cn(className)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormTextarea;

FormTextarea.propTypes = {
  form: PropTypes.shape({ control: PropTypes.any.isRequired }),
  lable: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};
