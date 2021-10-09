import { UploadIcon } from "@heroicons/react/outline";
import { useState } from "react";
import { WithClassname, WithMotion } from "../../../../common";
import { cn } from "../../../../common/utils/classes.util";
import { motion } from "framer-motion";
import { MinioFile } from "../../../../upload/models/files/minio-file.model";
import { useTranslation } from "react-i18next";

type Props<T> = WithClassname &
  WithMotion & {
    /** File upload class */
    uploadClass: { new (...args: any[]): T };
    /** File upload callback */
    onFileUpload: (file: T) => any;
    /** The placeholder to display in the button */
    placeholder: string;
    /** File formats accepted */
    format: string;
    /** Input name */
    name: string;
  };

export const UploadButton = <T extends any>({
  placeholder,
  uploadClass,
  format,
  className = "",
  name,
  onFileUpload,
  ...rest
}: Props<T>) => {
  const [file, setFile] = useState<T>();
  const { t } = useTranslation();

  const selectFile = async ({
    currentTarget,
  }: React.FormEvent<HTMLInputElement>) => {
    const inputFile = currentTarget.files?.item(0);
    if (inputFile) {
      const file = new uploadClass(inputFile, name);
      setFile(file);
      return onFileUpload(file);
    }
  };

  return (
    <motion.div
      {...rest}
      className={cn("flex flex-col text-center mb-4", className)}
    >
      <div className="bg-nx-red py-3 relative rounded-md transition-colors hover:bg-nx-red-dark text-white inline-flex justify-center items-center">
        <UploadIcon className="w-4 h-4 mr-2" />
        <span>{placeholder}</span>
        <input
          accept={format}
          type="file"
          className="opacity-0 absolute cursor-pointerb w-full h-full cursor-pointer text-none"
          onChange={selectFile}
          title={t("videoManagement.inputs.noFile")}
        />
      </div>
      {file && (
        <small className="text-gray-400">
          {(file as MinioFile).getFilename()}
        </small>
      )}
    </motion.div>
  );
};
