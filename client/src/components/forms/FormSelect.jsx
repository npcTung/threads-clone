import React from "react";
import PropTypes from "prop-types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui";

const FormSelect = ({ form, lable, name, options, placeholder }) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {lable && <FormLabel>{lable}</FormLabel>}
          <FormControl>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              name={field.name}
            >
              <SelectTrigger className="w-full bg-muted">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Giới tính</SelectLabel>
                  {options.map((el, idx) => (
                    <SelectItem key={idx} value={el.value}>
                      {el.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormSelect;

FormSelect.propTypes = {
  form: PropTypes.shape({ control: PropTypes.any.isRequired }),
  lable: PropTypes.string,
  name: PropTypes.string.isRequired,
  options: PropTypes.array,
  placeholder: PropTypes.string,
};
