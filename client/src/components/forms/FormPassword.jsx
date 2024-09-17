import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui";
import icons from "@/lib/icons";
import { cn } from "@/lib/utils";

const { Eye, EyeOff } = icons;

const FormPassword = ({ form, lable, name, placeholder }) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {lable && <FormLabel>{lable}</FormLabel>}
          <FormControl>
            <PasswordInput placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const PasswordInput = React.forwardRef(function PasswordInput(
  { className, type, ...props },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("pe-10", className)}
        ref={ref}
        {...props}
      />
      <div className="absolute right-2 top-2 text-gray-500">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger
              asChild
              className="cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <Eye className="size-5" />
              ) : (
                <EyeOff className="size-5" />
              )}
            </TooltipTrigger>
            <TooltipContent side="right" align="center">
              {showPassword ? "Hide password" : "Show password"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
});

export default FormPassword;

FormPassword.propTypes = {
  form: PropTypes.shape({ control: PropTypes.any.isRequired }),
  lable: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
};
