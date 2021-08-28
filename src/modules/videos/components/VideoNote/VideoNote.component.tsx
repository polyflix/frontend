import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useInjection } from "@polyflix/di";
import { Video } from "../../models/video.model";
import SimpleMdeReact from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { NoteService } from "../../services/note.service";

type Props = {
  video?: Video | null;
};

export const VideoNote: React.FC<Props> = ({ video }) => {
  // https://github.com/Ionaru/easy-markdown-editor#configuration

  const noteService = useInjection<NoteService>(NoteService);
  const [value, setValue] = useState<string>("");
  const [isUnsavedChange, setUnsavedChange] = useState(false);

  const onChange = (v: string) => {
    setValue(v);
    setUnsavedChange(true);
  };

  // GET note
  useEffect(() => {
    noteService
      .getNote(video!.id)
      .then((data: any) => {
        console.log(data);
        setValue(data.content);
      })
      .catch((err) => {
        setValue("");
      });
  }, [noteService, video]);

  //Save
  const saveChange = useCallback(() => {
    noteService.upsertNote(video!.id, { content: value });
    setUnsavedChange(false);
  }, [noteService, value, video]);

  useEffect(() => {
    const autoSave = setInterval(() => {
      if (isUnsavedChange) saveChange();
    }, 5000);
    return () => clearInterval(autoSave);
  }, [isUnsavedChange, saveChange]);

  const keyboardListener = useCallback(
    (e: KeyboardEvent) => {
      if (
        e.key === "s" &&
        (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)
      ) {
        e.preventDefault();
        if (isUnsavedChange) {
          saveChange();
        }
      }
    },
    [isUnsavedChange, saveChange]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyboardListener);
    return () => document.removeEventListener("keydown", keyboardListener);
  }, [keyboardListener]);

  //Editor Options
  const MDOptions = useMemo(() => {
    return {
      autoSave: false,
      // uploadImage: true,
      spellChecker: false,
      sideBySideFullscreen: false,
      minHeight: "550px",
      toolbar: [
        "bold" as const,
        "italic" as const,
        "heading" as const,
        "code" as const,
        "|" as const,
        "quote" as const,
        "unordered-list" as const,
        "table" as const,
        "|" as const,
        "link" as const,
        "image" as const,
        "|" as const,
        "preview" as const,
        "|" as const,
        "guide" as const,
        "|" as const,
      ],
    };
  }, []);

  return (
    <div id="FrameworkEditorContainer" className="relative prose max-w-none">
      <i
        className={`absolute inset-y-4 right-4 fa fab fa-save ${
          isUnsavedChange ? "text-nx-red" : "text-grey-500"
        }`}
      ></i>
      <SimpleMdeReact
        id="note"
        value={value}
        onChange={onChange}
        options={MDOptions}
      />
    </div>
  );
};
