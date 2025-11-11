import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
  HStack,
  IconButton,
  Spinner,
  Image,
} from "@chakra-ui/react";
import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  CheckIcon,
  CloseIcon,
} from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { useCategories } from "../../hooks/useCategories";
import type { BlogPayload } from "../../services/blogService";
import TiptapEditor from "../TipTapEditor";

export default function BlogForm({
  initialData,
  onSubmit,
  loading,
  buttonText = "Đăng bài",
}: {
  initialData?: Partial<BlogPayload>;
  onSubmit: (form: BlogPayload) => Promise<void> | void;
  loading?: boolean;
  buttonText?: string;
}) {
  const toast = useToast();
  const {
    data: categories,
    isLoading,
    addMutation,
    updateMutation,
    deleteMutation,
  } = useCategories();

  const [form, setForm] = useState<BlogPayload>({
    title: "",
    content: "",
    author: "",
    tags: [],
    categoryId: "",
  });

  const [newCat, setNewCat] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({ ...prev, ...initialData }));
      if (
        initialData.coverImage &&
        typeof initialData.coverImage === "object"
      ) {
        setCoverPreview((initialData.coverImage as any).secure_url);
      }
    }
  }, [initialData]);

  // ----------------------------
  // CRUD Category Functions
  // ----------------------------
  const handleAddCategory = async () => {
    if (!newCat.trim()) return;
    try {
      await addMutation.mutateAsync(newCat.trim());
      toast({
        title: `Tạo danh mục "${newCat}" thành công!`,
        status: "success",
      });
      setNewCat("");
    } catch {
      toast({ title: "Tạo danh mục thất bại", status: "error" });
    }
  };

  const handleEditCategory = async (id: string) => {
    if (!editingName.trim()) return;
    try {
      await updateMutation.mutateAsync({ id, name: editingName.trim() });
      toast({ title: "Cập nhật danh mục thành công!", status: "success" });
      setEditingId(null);
      setEditingName("");
    } catch {
      toast({ title: "Cập nhật thất bại", status: "error" });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast({ title: "Đã xoá danh mục", status: "info" });
      if (form.categoryId === id) setForm({ ...form, categoryId: "" });
    } catch {
      toast({ title: "Xoá thất bại", status: "error" });
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm({ ...form, coverImage: file });
    const previewURL = URL.createObjectURL(file);
    setCoverPreview(previewURL);
  };

  const removeCover = () => {
    setForm({ ...form, coverImage: undefined });
    setCoverPreview(null);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.content) {
      toast({ title: "Vui lòng nhập đầy đủ thông tin", status: "warning" });
      return;
    }
    try {
      await onSubmit(form);
      toast({
        title: `🎉 "${form.title}" đã được đăng!`,
        status: "success",
      });
      setForm({
        title: "",
        content: "",
        author: "",
        tags: [],
        categoryId: "",
      });
    } catch {
      toast({ title: "Đăng bài thất bại", status: "error" });
    }
  };

  return (
    <Box
      maxW="800px"
      mx="auto"
      mt={6}
      bg="white"
      p={6}
      rounded="md"
      shadow="md"
    >
      <VStack align="stretch" spacing={4}>
        {/* --- Danh mục CRUD --- */}
        <FormControl>
          <FormLabel>Danh mục</FormLabel>
          {isLoading ? (
            <Spinner />
          ) : (
            <Select
              placeholder="Chọn danh mục"
              value={form.categoryId || ""}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            >
              {categories?.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </Select>
          )}

          {/* Thêm mới */}
          <HStack mt={2}>
            <Input
              placeholder="Tạo danh mục mới..."
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
            />
            <Button
              leftIcon={<AddIcon />}
              colorScheme="green"
              onClick={handleAddCategory}
              isLoading={addMutation.isPending}
            >
              Thêm
            </Button>
          </HStack>

          {/* Danh sách CRUD hiển thị */}
          <VStack align="stretch" mt={3} spacing={1}>
            {categories?.map((cat) => (
              <HStack key={cat._id}>
                {editingId === cat._id ? (
                  <>
                    <Input
                      size="sm"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                    />
                    <IconButton
                      icon={<CheckIcon />}
                      size="sm"
                      aria-label="save"
                      onClick={() => handleEditCategory(cat._id)}
                    />
                    <IconButton
                      icon={<CloseIcon />}
                      size="sm"
                      aria-label="cancel"
                      onClick={() => setEditingId(null)}
                    />
                  </>
                ) : (
                  <>
                    <Box flex="1">{cat.name}</Box>
                    <IconButton
                      icon={<EditIcon />}
                      size="sm"
                      aria-label="edit"
                      onClick={() => {
                        setEditingId(cat._id);
                        setEditingName(cat.name);
                      }}
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      size="sm"
                      colorScheme="red"
                      aria-label="delete"
                      onClick={() => handleDeleteCategory(cat._id)}
                    />
                  </>
                )}
              </HStack>
            ))}
          </VStack>
        </FormControl>

        {/* --- Các input khác --- */}
        <FormControl>
          <FormLabel>Tiêu đề</FormLabel>
          <Input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </FormControl>

        {/* --- Ảnh bìa --- */}
        <FormControl>
          <FormLabel>Ảnh bìa</FormLabel>
          <Input type="file" accept="image/*" onChange={handleCoverChange} />
          {coverPreview && (
            <Box mt={3} position="relative" w="100%">
              <Image
                src={coverPreview}
                alt="Preview"
                rounded="md"
                maxH="200px"
                objectFit="cover"
              />
              <Button
                mt={2}
                size="sm"
                colorScheme="red"
                variant="outline"
                onClick={removeCover}
              >
                Xoá ảnh
              </Button>
            </Box>
          )}
        </FormControl>

        {/* ✅ Thêm phần nội dung */}
        <FormControl>
          <FormLabel>Nội dung</FormLabel>
          <TiptapEditor
            value={form.content}
            onChange={(html: any) => setForm({ ...form, content: html })}
          />
        </FormControl>

        <Button
          colorScheme="blue"
          onClick={handleSubmit}
          isLoading={loading}
          alignSelf="flex-end"
        >
          {buttonText}
        </Button>
      </VStack>
    </Box>
  );
}
