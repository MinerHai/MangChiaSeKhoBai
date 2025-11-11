import { Box, Divider, HStack, IconButton, Tooltip } from "@chakra-ui/react";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Underline,
} from "lucide-react";

type Props = {
  value?: string; // HTML
  onChange: (html: string) => void;
  minHeight?: number;
};

export default function TiptapEditor({
  value = "<p></p>",
  onChange,
  minHeight = 280,
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Image,
      Link.configure({ openOnClick: true, autolink: true, linkOnPaste: true }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-sm md:prose lg:prose-lg max-w-none focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("Nhập URL ảnh");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const addLink = () => {
    const url = window.prompt("Nhập URL liên kết");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <Box border="1px" borderColor="gray.200" rounded="md" p={3}>
      <HStack spacing={1} wrap="wrap">
        <Tooltip label="Heading 1">
          <IconButton
            aria-label="h1"
            size="sm"
            variant="ghost"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            icon={<Heading1 size={18} />}
          />
        </Tooltip>
        <Tooltip label="Heading 2">
          <IconButton
            aria-label="h2"
            size="sm"
            variant="ghost"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            icon={<Heading2 size={18} />}
          />
        </Tooltip>
        <Divider orientation="vertical" h={6} />

        <Tooltip label="Đậm">
          <IconButton
            aria-label="bold"
            size="sm"
            variant={editor.isActive("bold") ? "solid" : "ghost"}
            onClick={() => editor.chain().focus().toggleBold().run()}
            icon={<Bold size={18} />}
          />
        </Tooltip>
        <Tooltip label="Nghiêng">
          <IconButton
            aria-label="italic"
            size="sm"
            variant={editor.isActive("italic") ? "solid" : "ghost"}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            icon={<Italic size={18} />}
          />
        </Tooltip>
        <Tooltip label="Gạch chân">
          <IconButton
            aria-label="underline"
            size="sm"
            variant={editor.isActive("underline") ? "solid" : "ghost"}
            onClick={() => editor.chain().focus().toggleUnderline?.().run()}
            icon={<Underline size={18} />}
          />
        </Tooltip>
        <Divider orientation="vertical" h={6} />

        <Tooltip label="Danh sách số">
          <IconButton
            aria-label="ol"
            size="sm"
            variant={editor.isActive("orderedList") ? "solid" : "ghost"}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            icon={<ListOrdered size={18} />}
          />
        </Tooltip>
        <Tooltip label="Danh sách chấm">
          <IconButton
            aria-label="ul"
            size="sm"
            variant={editor.isActive("bulletList") ? "solid" : "ghost"}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            icon={<List size={18} />}
          />
        </Tooltip>
        <Divider orientation="vertical" h={6} />

        <Tooltip label="Trích dẫn">
          <IconButton
            aria-label="quote"
            size="sm"
            variant={editor.isActive("blockquote") ? "solid" : "ghost"}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            icon={<Quote size={18} />}
          />
        </Tooltip>
        <Tooltip label="Code block">
          <IconButton
            aria-label="code"
            size="sm"
            variant={editor.isActive("codeBlock") ? "solid" : "ghost"}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            icon={<Code size={18} />}
          />
        </Tooltip>
        <Divider orientation="vertical" h={6} />

        <Tooltip label="Thêm liên kết">
          <IconButton
            aria-label="link"
            size="sm"
            variant={editor.isActive("link") ? "solid" : "ghost"}
            onClick={addLink}
            icon={<LinkIcon size={18} />}
          />
        </Tooltip>
        <Tooltip label="Thêm ảnh (URL)">
          <IconButton
            aria-label="image"
            size="sm"
            variant="ghost"
            onClick={addImage}
            icon={<ImageIcon size={18} />}
          />
        </Tooltip>
      </HStack>

      <Box mt={3} minH={minHeight} px={1}>
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
}
