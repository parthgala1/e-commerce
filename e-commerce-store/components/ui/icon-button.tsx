import { cn } from "@/lib/utils";
import { MouseEventHandler } from "react";

interface IconButtonProps {
  icon: React.ReactElement;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full flex items-center justify-center bg-white border shadow-md p-2 hover:scale-110 transition",
        className
      )}
    >
      {icon}
    </button>
  );
};

export default IconButton;
