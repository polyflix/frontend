import { CloudUploadIcon } from "@heroicons/react/outline";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { cn, WithClassname } from "../../../common";

type Props = WithClassname & {
  /**
   * The list of files accepted by the Dropzone.
   * @example
   * accept=".txt,.pdf"
   */
  accept?: string | string[];
  /**
   * Set this to true if you want to disable the Dropzone.
   */
  disabled?: boolean;
  /**
   * Set this to true if you want to be able to drop multiple files.
   */
  multiple?: boolean;
  /**
   * A callback method to call when files are dropped.
   */
  onDrop: (files: File[]) => void;
};

export const Dropzone = ({
  onDrop,
  multiple = false,
  accept,
  disabled = false,
}: Props) => {
  const { t } = useTranslation("dropzone");
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept,
    disabled,
  });

  const key = multiple ? "multiple" : "single";
  return (
    <div
      className={cn(
        "px-5 group py-8 transition-all border border-dashed rounded-md flex items-center justify-center cursor-pointer",
        disabled
          ? "cursor-not-allowed border-lightgray text-lightgray"
          : "bg-transparent"
      )}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center text-center">
        <CloudUploadIcon
          className={cn(
            "w-10 transition-all",
            isDragActive && "text-nx-red",
            !disabled && "group-hover:text-nx-red"
          )}
        />
        <div className="text-sm mt-2">
          {isDragActive ? (
            <p>{t(`${key}.dragActive`)}</p>
          ) : (
            <p>{t(`${key}.dnd`)}</p>
          )}
        </div>
      </div>
    </div>
  );
};
