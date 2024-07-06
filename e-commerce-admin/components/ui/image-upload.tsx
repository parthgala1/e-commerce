"use client";

import { useEffect, useState } from "react";
import { ImagePlayIcon, ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  diasbled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUplaod: React.FC<ImageUploadProps> = ({
  diasbled,
  onChange,
  onRemove,
  value,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div>
      <div className="md-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden "
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
              >
                <Trash size="icon" className="h-4 w-4" />
              </Button>
            </div>
            <Image
              src={url}
              fill
              alt="Product Image"
              className="object-cover"
            />
          </div>
        ))}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset="aefv0gea">
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <Button
              disabled={diasbled}
              type="button"
              variant="secondary"
              onClick={onClick}
            >
              <ImagePlus size="icon" className="h-4 w-4 mr-2" />
              Upload a Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUplaod;
