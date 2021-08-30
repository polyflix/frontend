import { useInjection } from "@polyflix/di";
import { useState } from "react";
import { LocalFileService } from "../../common/services/local-file.service";
import { Quizz } from "../models/quizz.model";
import { QuizzService } from "../services/quizz.service";

interface QuizzFile {
  file: File;
  content: string;
  quizz?: Quizz;
}

export const useQuizzImport = () => {
  const quizzService = useInjection<QuizzService>(QuizzService);
  const localFileService = useInjection<LocalFileService>(LocalFileService);

  const [quizzFile, setQuizzFile] = useState<QuizzFile>();
  const [validated, setValidated] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  const importFile = async ([file]: File[]) => {
    if (!file) setError("There is no file to import.");

    const data = await localFileService.readAsText(file);

    if (!data) setError("An error occured during the file reading process.");

    try {
      const quizz = quizzService.importFromFile(data);
      setQuizzFile({
        content: data,
        quizz,
        file,
      });
    } catch (e) {
      setError(e.message);
    }
  };

  return {
    isValid: validated,
    data: quizzFile,
    importFile,
    clear: () => setQuizzFile(undefined),
    validate: () => setValidated(true),
    error,
  };
};
