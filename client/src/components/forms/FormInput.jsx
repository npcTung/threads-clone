import React from "react";
import PropTypes from "prop-types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "../ui";

const FormInput = ({ form, lable, name, type = "text", placeholder }) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {lable && <FormLabel>{lable}</FormLabel>}
          <FormControl>
            <Input placeholder={placeholder} {...field} type={type} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInput;

FormInput.propTypes = {
  form: PropTypes.shape({ control: PropTypes.any.isRequired }),
  lable: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
};
