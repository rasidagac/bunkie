"use client";

import type React from "react";
import type { ComponentProps } from "react";

import {
  X,
  Upload,
  File,
  ImageIcon,
  FileText,
  Music,
  Video,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type FileItem = File | string;

interface FileInputProps
  extends Omit<ComponentProps<"input">, "value" | "onChange"> {
  value?: FileItem[];
  onChange?: (files: FileItem[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
};

const getFileIcon = (type: string) => {
  if (type.startsWith("image/") || type === "image/url") return ImageIcon;
  if (type.startsWith("video/")) return Video;
  if (type.startsWith("audio/")) return Music;
  if (type.includes("text") || type.includes("document")) return FileText;
  return File;
};

const getFileNameFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const fileName = pathname.split("/").pop();
    return fileName || `Image ${Math.floor(Math.random() * 1000)}`;
  } catch {
    return `Image ${Math.floor(Math.random() * 1000)}`;
  }
};

const isImageUrl = (url: string): boolean => {
  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".svg",
    ".bmp",
  ];
  const lowerUrl = url.toLowerCase();
  return (
    imageExtensions.some((ext) => lowerUrl.includes(ext)) ||
    lowerUrl.includes("image")
  );
};

function FilePreview({
  file,
  onRemove,
}: {
  file: FileItem;
  onRemove: () => void;
}) {
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // Check if it's a URL string or File object
  const isUrl = typeof file === "string";
  const fileName = isUrl ? getFileNameFromUrl(file) : file.name;
  const fileSize = isUrl ? 0 : file.size;
  const fileType = isUrl ? (isImageUrl(file) ? "image/url" : "url") : file.type;

  const IconComponent = getFileIcon(fileType);

  useEffect(() => {
    if (isUrl) {
      setPreviewUrl(file);
    } else if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file, isUrl]);

  const shouldShowImagePreview =
    (isUrl && isImageUrl(file)) || (!isUrl && file.type.startsWith("image/"));

  return (
    <Card className="group relative">
      <CardContent className="p-3">
        <div className="grid grid-cols-12 grid-rows-1 items-start gap-3">
          <div className="col-span-3 size-full">
            {shouldShowImagePreview && previewUrl ? (
              <div className="bg-muted relative size-full overflow-hidden rounded-md">
                <Image
                  src={previewUrl || "/placeholder.svg"}
                  alt={fileName}
                  className="object-cover"
                  fill
                  sizes="70px"
                  priority
                />
              </div>
            ) : (
              <div className="bg-muted flex size-full items-center justify-center rounded-md">
                <IconComponent className="text-muted-foreground h-6 w-6" />
              </div>
            )}
          </div>
          <div className="col-span-7">
            <p className="truncate text-sm font-medium" title={fileName}>
              {fileName}
            </p>
            <div className="mt-1 flex items-center gap-2">
              {fileSize > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {formatFileSize(fileSize)}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {isUrl ? "URL" : fileType || "Unknown"}
              </Badge>
            </div>
            {isUrl && (
              <p
                className="text-muted-foreground mt-1 truncate text-xs"
                title={file}
              >
                {file}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="col-span-2 p-0 lg:opacity-0 lg:transition-opacity lg:group-hover:opacity-100"
            aria-label={`Remove ${fileName}`}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function FileInput({
  value,
  onChange,
  accept,
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 5,
  className,
  disabled = false,
  placeholder = "Choose files or drag and drop",
  ...props
}: FileInputProps) {
  const [internalFiles, setInternalFiles] = useState<FileItem[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const isControlled = value !== undefined;
  const files = isControlled ? value : internalFiles;

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File "${file.name}" is too large. Maximum size is ${formatFileSize(maxSize)}.`;
    }

    if (accept) {
      const acceptedTypes = accept.split(",").map((type) => type.trim());
      const isValidType = acceptedTypes.some((type) => {
        if (type.startsWith(".")) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        if (type.includes("*")) {
          const baseType = type.split("/")[0];
          return file.type.startsWith(baseType);
        }
        return file.type === type;
      });

      if (!isValidType) {
        return `File "${file.name}" is not a valid file type. Accepted types: ${accept}`;
      }
    }

    return null;
  };

  const processFiles = (fileList: FileList) => {
    setError("");
    const newFiles: FileItem[] = [];
    const errors: string[] = [];

    Array.from(fileList).forEach((file) => {
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(validationError);
        return;
      }

      if (!multiple && files.length + newFiles.length >= 1) {
        errors.push("Only one file is allowed.");
        return;
      }

      if (files.length + newFiles.length >= maxFiles) {
        errors.push(`Maximum ${maxFiles} files allowed.`);
        return;
      }

      newFiles.push(file);
    });

    if (errors.length > 0) {
      setError(errors[0]);
      return;
    }

    const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
    // Handle controlled vs uncontrolled mode
    if (isControlled) {
      onChange?.(updatedFiles);
    } else {
      setInternalFiles(updatedFiles);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const { files: droppedFiles } = e.dataTransfer;
    if (droppedFiles && droppedFiles.length > 0) {
      processFiles(droppedFiles);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    if (disabled || isProcessing) return;

    setIsProcessing(true);
    const { files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles.length > 0) {
      processFiles(selectedFiles);
    }

    // Reset the input value to allow selecting the same file again
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    // Reset processing state after a brief delay
    setTimeout(() => setIsProcessing(false), 100);
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    // Handle controlled vs uncontrolled mode
    if (isControlled) {
      onChange?.(updatedFiles);
    } else {
      setInternalFiles(updatedFiles);
    }
    setError("");
  };

  const openFileDialog = () => {
    if (!disabled && !isProcessing) {
      inputRef.current?.click();
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "relative rounded-lg border-2 border-dashed p-4 transition-colors",
          dragActive && !disabled
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25",
          disabled && "cursor-not-allowed opacity-50",
          !disabled && "hover:border-primary/50 cursor-pointer",
          props["aria-invalid"] &&
            "ring-destructive/20 dark:ring-destructive/40 border-destructive",
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={(e) => {
          // Only open dialog if clicking on the container itself, not child elements
          if (e.target === e.currentTarget && !isProcessing) {
            openFileDialog();
          }
        }}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="File upload area"
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) {
            e.preventDefault();
            openFileDialog();
          }
        }}
      >
        <Input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          onClick={(e) => e.stopPropagation()}
          disabled={disabled}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          tabIndex={-1}
          {...props}
        />

        <div className="flex flex-col items-center justify-center text-center">
          <Upload className="text-muted-foreground mb-4 size-6" />
          <p className="text-md mb-2 font-medium">{placeholder}</p>
          <p className="text-muted-foreground mb-2 text-xs">
            {accept ? `Accepted formats: ${accept}` : "All file types accepted"}
          </p>
          <p className="text-muted-foreground text-xs">
            Maximum file size: {formatFileSize(maxSize)}
            {multiple && ` • Maximum ${maxFiles} files`}
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium">
            Selected files ({files.length}
            {multiple && `/${maxFiles}`})
          </p>
          {files.map((file, index) => (
            <FilePreview
              key={
                typeof file === "string"
                  ? `url-${index}`
                  : `file-${index}-${file.name}`
              }
              file={file}
              onRemove={() => removeFile(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Export types for external use
export type { FileItem };
