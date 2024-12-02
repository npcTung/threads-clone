import { cn } from "@/lib/utils";
import { EditorContent } from "@tiptap/react";
import React, { memo } from "react";
import "./styles.css";
import { ScrollArea } from "./ui";

const EditInput = ({ editor, className }) => {
  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <ScrollArea className={cn("w-full", className)}>
      <EditorContent editor={editor} className={cn("w-full", className)} />
    </ScrollArea>
  );
};

export default memo(EditInput);
