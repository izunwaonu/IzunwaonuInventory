"use client";

import React, { useState, useEffect } from "react";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import { Level } from "@tiptap/extension-heading";

import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Code,
  Image as ImageIcon,
  Undo,
  Redo,
  Quote,
  Eye,
  Link as LinkIcon,
  Unlink,
  Strikethrough,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
} from "lucide-react";

interface EditorProps {
  variant?: "default" | "compact";
  initialContent?: string;
  content?: string;
  setContent?: (content: string) => void;
  isEditable?: boolean;
}

export default function VEditor({
  variant = "default",
  initialContent = "<p>Start writing your document here...</p>",
  content,
  setContent,
  isEditable = true,
}: EditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline",
        },
      }),
      Subscript,
      Superscript,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: content || initialContent,
    editable: isEditable,
    editorProps: {
      attributes: {
        class: `${
          variant === "default" ? "min-h-[20cm]" : "h-40"
        } w-full mx-auto p-4 shadow-lg border rounded-lg prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none bg-white overflow-y-auto`,
      },
    },
    onUpdate: ({ editor }) => {
      if (setContent) {
        setContent(editor.getHTML());
      }
    },
  });

  useEffect(() => {
    if (editor && content !== undefined) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl("");
      setShowImageDialog(false);
    }
  };

  const setLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
    setShowLinkDialog(false);
    setLinkUrl("");
  };

  const toggleHeading = (level: Level) => {
    editor.chain().focus().toggleHeading({ level }).run();
  };

  return (
    <div className={`bg-gray-100 p-4 ${variant === "default" ? "lg:p-8" : ""}`}>
      <div
        className={`mx-auto ${
          variant === "default" ? "max-w-[21cm]" : "max-w-full"
        }`}
      >
        {isEditable && (
          <div className="mb-4 rounded-lg border bg-white shadow-sm">
            <div className="flex flex-wrap items-center gap-1 border-b p-2">
              <Select
                value={
                  editor.isActive("heading", { level: 1 })
                    ? "h1"
                    : editor.isActive("heading", { level: 2 })
                      ? "h2"
                      : editor.isActive("heading", { level: 3 })
                        ? "h3"
                        : editor.isActive("heading", { level: 4 })
                          ? "h4"
                          : "p"
                }
                onValueChange={(value) => {
                  if (value === "p")
                    editor.chain().focus().setParagraph().run();
                  if (value === "h1") toggleHeading(1);
                  if (value === "h2") toggleHeading(2);
                  if (value === "h3") toggleHeading(3);
                  if (value === "h4") toggleHeading(4);
                }}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="p">Paragraph</SelectItem>
                  <SelectItem value="h1">Heading 1</SelectItem>
                  <SelectItem value="h2">Heading 2</SelectItem>
                  <SelectItem value="h3">Heading 3</SelectItem>
                  <SelectItem value="h4">Heading 4</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-1">
                <Toggle
                  size="sm"
                  pressed={editor.isActive("bold")}
                  onPressedChange={() =>
                    editor.chain().focus().toggleBold().run()
                  }
                  aria-label="Toggle bold"
                >
                  <Bold className="h-4 w-4" />
                </Toggle>
                <Toggle
                  size="sm"
                  pressed={editor.isActive("italic")}
                  onPressedChange={() =>
                    editor.chain().focus().toggleItalic().run()
                  }
                  aria-label="Toggle italic"
                >
                  <Italic className="h-4 w-4" />
                </Toggle>
                <Toggle
                  size="sm"
                  pressed={editor.isActive("strike")}
                  onPressedChange={() =>
                    editor.chain().focus().toggleStrike().run()
                  }
                  aria-label="Toggle strikethrough"
                >
                  <Strikethrough className="h-4 w-4" />
                </Toggle>
              </div>

              <div className="flex items-center gap-1">
                <Toggle
                  size="sm"
                  pressed={editor.isActive("subscript")}
                  onPressedChange={() =>
                    editor.chain().focus().toggleSubscript().run()
                  }
                  aria-label="Toggle subscript"
                >
                  <SubscriptIcon className="h-4 w-4" />
                </Toggle>
                <Toggle
                  size="sm"
                  pressed={editor.isActive("superscript")}
                  onPressedChange={() =>
                    editor.chain().focus().toggleSuperscript().run()
                  }
                  aria-label="Toggle superscript"
                >
                  <SuperscriptIcon className="h-4 w-4" />
                </Toggle>
              </div>

              <div className="flex items-center gap-1">
                <Toggle
                  size="sm"
                  pressed={editor.isActive({ textAlign: "left" })}
                  onPressedChange={() =>
                    editor.chain().focus().setTextAlign("left").run()
                  }
                  aria-label="Align left"
                >
                  <AlignLeft className="h-4 w-4" />
                </Toggle>
                <Toggle
                  size="sm"
                  pressed={editor.isActive({ textAlign: "center" })}
                  onPressedChange={() =>
                    editor.chain().focus().setTextAlign("center").run()
                  }
                  aria-label="Align center"
                >
                  <AlignCenter className="h-4 w-4" />
                </Toggle>
                <Toggle
                  size="sm"
                  pressed={editor.isActive({ textAlign: "right" })}
                  onPressedChange={() =>
                    editor.chain().focus().setTextAlign("right").run()
                  }
                  aria-label="Align right"
                >
                  <AlignRight className="h-4 w-4" />
                </Toggle>
              </div>

              <div className="flex items-center gap-1">
                <Toggle
                  size="sm"
                  pressed={editor.isActive("bulletList")}
                  onPressedChange={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                  aria-label="Toggle bullet list"
                >
                  <List className="h-4 w-4" />
                </Toggle>
                <Toggle
                  size="sm"
                  pressed={editor.isActive("orderedList")}
                  onPressedChange={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
                  aria-label="Toggle ordered list"
                >
                  <ListOrdered className="h-4 w-4" />
                </Toggle>
                <Toggle
                  size="sm"
                  pressed={editor.isActive("blockquote")}
                  onPressedChange={() =>
                    editor.chain().focus().toggleBlockquote().run()
                  }
                  aria-label="Toggle blockquote"
                >
                  <Quote className="h-4 w-4" />
                </Toggle>
              </div>

              <div className="flex items-center gap-1">
                <Toggle
                  size="sm"
                  pressed={editor.isActive("codeBlock")}
                  onPressedChange={() =>
                    editor.chain().focus().toggleCodeBlock().run()
                  }
                  aria-label="Toggle code block"
                >
                  <Code className="h-4 w-4" />
                </Toggle>
                <Dialog
                  open={showImageDialog}
                  onOpenChange={setShowImageDialog}
                >
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" aria-label="Insert image">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Insert Image</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="image-url" className="text-right">
                          Image URL
                        </Label>
                        <Input
                          id="image-url"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <Button onClick={addImage}>Insert Image</Button>
                  </DialogContent>
                </Dialog>
                <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" aria-label="Insert link">
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Insert Link</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="link-url" className="text-right">
                          Link URL
                        </Label>
                        <Input
                          id="link-url"
                          value={linkUrl}
                          onChange={(e) => setLinkUrl(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <Button onClick={setLink}>Set Link</Button>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor.can().undo()}
                  aria-label="Undo"
                >
                  <Undo className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor.can().redo()}
                  aria-label="Redo"
                >
                  <Redo className="h-4 w-4" />
                </Button>
              </div>

              <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="ml-auto">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </DialogTrigger>
                <DialogHeader>
                  <DialogTitle></DialogTitle>
                </DialogHeader>
                <DialogContent className="max-w-[21cm] w-full max-h-[50vh] overflow-y-auto">
                  <div className="prose max-w-none">
                    <div
                      dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}

        <EditorContent editor={editor} />

        <div className="mt-2 text-sm text-muted-foreground">
          {/* {editor.storage.characterCount.words()} words */}
          {0} words
        </div>
      </div>

      {isEditable && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLinkDialog(true)}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().unsetLink().run()}
          >
            <Unlink className="h-4 w-4" />
          </Button>
        </BubbleMenu>
      )}
    </div>
  );
}
