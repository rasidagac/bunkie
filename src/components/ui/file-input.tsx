"use client";

import type { ComponentProps } from "react";

import {
  File,
  FileText,
  ImageIcon,
  Music,
  Upload,
  Video,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FileInputProps
  extends Omit<ComponentProps<"input">, "onChange" | "value"> {
  accept?: string;
  className?: string;
  disabled?: boolean;
  maxFiles?: number;
  maxSize?: number; // in bytes
  multiple?: boolean;
  onChange?: (files: File[]) => void;
  placeholder?: string;
  value?: File[];
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
  if (type.startsWith("image/")) return ImageIcon;
  if (type.startsWith("video/")) return Video;
  if (type.startsWith("audio/")) return Music;
  if (type.includes("text") || type.includes("document")) return FileText;
  return File;
};

export function FileInput({
  accept,
  className,
  disabled = false,
  maxFiles = 5,
  maxSize = 3 * 1024 * 1024, // 10MB default
  multiple = false,
  onChange,
  placeholder = "Choose files or drag and drop",
  value,
  ...props
}: FileInputProps) {
  const [internalFiles, setInternalFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const isControlled = value !== undefined;
  const files = isControlled ? value : internalFiles;

  const validateFile = (file: File): null | string => {
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
    const newFiles: File[] = [];
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

      const File: File = Object.assign(file, {
        id: Math.random().toString(36).substring(7),
      });

      newFiles.push(File);
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
        aria-label="File upload area"
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
        onClick={(e) => {
          // Only open dialog if clicking on the container itself, not child elements
          if (e.target === e.currentTarget && !isProcessing) {
            openFileDialog();
          }
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) {
            e.preventDefault();
            openFileDialog();
          }
        }}
        role="button"
        tabIndex={disabled ? -1 : 0}
      >
        <Input
          accept={accept}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:opacity-0"
          disabled={disabled}
          multiple={multiple}
          onChange={handleChange}
          onClick={(e) => e.stopPropagation()}
          ref={inputRef}
          tabIndex={-1}
          type="file"
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
        <Alert className="mt-4" variant="destructive">
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
              disabled={disabled}
              file={file}
              key={`${file.name}-${file.size}-${file.lastModified}`}
              onRemove={() => removeFile(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilePreview({
  disabled,
  file,
  onRemove,
}: {
  disabled: boolean;
  file: File;
  onRemove: () => void;
}) {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const IconComponent = getFileIcon(file.type);

  useEffect(() => {
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  return (
    <Card className={cn("group relative", disabled && "opacity-50")}>
      <CardContent className="p-3">
        <div className="grid grid-cols-12 items-start gap-3">
          <div className="col-span-2 flex-shrink-0">
            {file.type.startsWith("image/") && previewUrl ? (
              <div className="bg-muted h-12 w-12 overflow-hidden rounded-md">
                <Image
                  alt={file.name}
                  className="h-full w-full object-cover"
                  height={48}
                  src={previewUrl || "/placeholder.svg"}
                  width={48}
                />
              </div>
            ) : (
              <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-md">
                <IconComponent className="text-muted-foreground h-6 w-6" />
              </div>
            )}
          </div>
          <div className="col-span-8 min-w-0 flex-1">
            <p className="truncate text-sm font-medium" title={file.name}>
              {file.name}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <Badge className="text-xs" variant="secondary">
                {formatFileSize(file.size)}
              </Badge>
              <Badge className="text-xs" variant="outline">
                {file.type || "Unknown"}
              </Badge>
            </div>
          </div>
          <Button
            aria-label={`Remove ${file.name}`}
            className="col-span-2 p-0 disabled:opacity-0 lg:opacity-0 lg:transition-opacity lg:group-hover:opacity-100"
            disabled={disabled}
            onClick={onRemove}
            size="sm"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
