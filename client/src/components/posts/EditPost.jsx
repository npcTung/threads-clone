import { cn } from "@/lib/utils";
import { EditorContent } from "@tiptap/react";
import React from "react";
import "./styles.css";

const EditPost = ({ editor }) => {
  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="w-full">
      <EditorContent
        editor={editor}
        className={cn(
          "max-h-[10rem] w-full max-w-[752px] overflow-y-auto rounded-2xl px-5 py-3"
          // isDragActive && "outline-dashed",
        )}
      />
    </div>
  );
};

export default EditPost;
