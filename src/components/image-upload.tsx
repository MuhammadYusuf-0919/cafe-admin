import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Upload, Image, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export function ImageUpload({ 
  value, 
  onChange, 
  className,
  disabled = false
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(value || "");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        onChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        onChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setPreviewUrl("");
    onChange("");
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {previewUrl ? (
        <div className="relative rounded-lg overflow-hidden h-56 w-full group">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={handleButtonClick}
              disabled={disabled}
              className="mr-2"
            >
              <Upload className="w-4 h-4 mr-1" />
              Change
            </Button>
            <Button 
              size="sm" 
              variant="destructive" 
              onClick={handleRemoveImage}
              disabled={disabled}
            >
              <X className="w-4 h-4 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg h-56 flex flex-col items-center justify-center cursor-pointer transition-colors",
            isDragging 
              ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700" 
              : "hover:bg-gray-50 dark:hover:bg-gray-800",
            disabled && "opacity-60 cursor-not-allowed"
          )}
          onDragOver={!disabled ? handleDragOver : undefined}
          onDragLeave={!disabled ? handleDragLeave : undefined}
          onDrop={!disabled ? handleDrop : undefined}
          onClick={!disabled ? handleButtonClick : undefined}
        >
          <div className="flex flex-col items-center justify-center text-center p-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
              <Image className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Drag & drop image here or click to upload
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Supports: JPG, PNG, GIF (Max 5MB)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
