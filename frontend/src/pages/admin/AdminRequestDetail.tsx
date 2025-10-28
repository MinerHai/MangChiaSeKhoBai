import {
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import fetchRequestDetail from "../../services/admin/fetchRequestDetail";
import { ZoomableImage } from "../../components/ZoomableImage";
import responseRequest from "../../services/admin/responseRequest";

const AdminRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["roleRequest", id],
    queryFn: () => fetchRequestDetail(id!),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 phút
  });

  const mutation = useMutation({
    mutationFn: responseRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roleRequests"] });
      toast({
        title: "Thao tác thành công!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      navigate(-1);
    },
    onError: () => {
      toast({
        title: "Lỗi khi cập nhật trạng thái!",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    },
  });

  if (isLoading)
    return (
      <Flex justify="center" align="center" minH="70vh">
        <Spinner size="xl" />
      </Flex>
    );

  if (isError)
    return (
      <Box textAlign="center" mt={10}>
        <Text>Không thể tải dữ liệu.</Text>
        <Button mt={4} onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </Box>
    );

  const request = data?.request;
  const user = data?.request.user;

  return (
    <Box p={8}>
      <Heading size="lg" mb={6}>
        Chi tiết yêu cầu
      </Heading>

      {/* Thông tin người dùng */}
      <Box borderWidth="1px" borderRadius="md" p={6} mb={6}>
        <Heading size="md" mb={4}>
          Thông tin người dùng
        </Heading>
        <Stack spacing={2}>
          <Text>
            <b>Tên:</b> {user?.username}
          </Text>
          <Text>
            <b>Email:</b> {user?.email}
          </Text>
          <Text>
            <b>Trạng thái:</b>{" "}
            <Text as="span" color="teal.600" fontWeight="bold">
              {request?.status}
            </Text>
          </Text>
        </Stack>
      </Box>

      {/* Danh sách ảnh */}
      <Box borderWidth="1px" borderRadius="md" p={6} mb={6}>
        <Heading size="md" mb={4}>
          Ảnh minh chứng
        </Heading>
        <Flex gap={4} flexWrap="wrap">
          {request?.images?.length ? (
            request.images.map((img: any, i: number) => (
              <ZoomableImage
                key={i}
                src={img.secure_url}
                alt={`Ảnh minh chứng ${i + 1}`}
              />
            ))
          ) : (
            <Text>Không có ảnh minh chứng</Text>
          )}
        </Flex>
      </Box>

      {/* Các nút thao tác */}
      <Flex gap={3}>
        <Button onClick={() => navigate(-1)}>⬅ Quay lại</Button>
        {request?.status === "pending" ? (
          <>
            <Button
              colorScheme="green"
              onClick={() => mutation.mutate({ id: id!, status: "approved" })}
              isLoading={
                mutation.isPending && mutation.variables?.status === "approved"
              }
            >
              ✅ Chấp nhận
            </Button>
            <Button
              colorScheme="red"
              onClick={() => mutation.mutate({ id: id!, status: "rejected" })}
              isLoading={
                mutation.isPending && mutation.variables?.status === "rejected"
              }
            >
              ❌ Từ chối
            </Button>
          </>
        ) : null}
      </Flex>
    </Box>
  );
};
export default AdminRequestDetail;
