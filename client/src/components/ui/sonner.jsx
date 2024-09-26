import { Toaster as Sonner } from "sonner";
import { useTheme } from "..";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return <Sonner theme={theme} className="toaster group" {...props} />;
};

export { Toaster };
