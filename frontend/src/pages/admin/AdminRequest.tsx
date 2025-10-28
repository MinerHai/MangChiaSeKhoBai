import {
  Box,
  Flex,
  Heading,
  Input,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Spinner,
  Text,
  HStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { fetchRoleRequests } from "../../services/admin/requestService";
import { useNavigate } from "react-router-dom";

export default function AdminRequests() {
  const [status, setStatus] = useState("all");
  const [email, setEmail] = useState("");
  const [search, setSearch] = useState(""); // để debounce
  const [page, setPage] = useState(1);
  const limit = 5;
  const navigate = useNavigate();
  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setSearch(email), 500);
    return () => clearTimeout(timer);
  }, [email]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["roleRequests", status, search, page],
    queryFn: () =>
      fetchRoleRequests({
        status,
        email: search,
        page,
        limit,
        token: localStorage.getItem("token") || "",
      }),
    placeholderData: (prev) => prev,
    staleTime: 10 * 60 * 1000, // 10 phút
  });

  const requests = data?.requests || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <Box>
      <Heading size="lg" mb={6}>
        Role Requests
      </Heading>

      {/* Filters */}
      <Flex mb={4} gap={4} wrap="wrap">
        <Select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          w="200px"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </Select>

        <Input
          placeholder="Search by email..."
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setPage(1);
          }}
          w="250px"
        />

        <Button onClick={() => refetch()}>Search</Button>
      </Flex>

      {/* Table */}
      <Box borderWidth="1px" borderRadius="lg" overflowX="auto">
        {isLoading ? (
          <Flex justify="center" py={10}>
            <Spinner size="lg" />
          </Flex>
        ) : isError ? (
          <Text color="red.500" p={4}>
            Failed to load data
          </Text>
        ) : requests.length === 0 ? (
          <Text p={4}>No requests found</Text>
        ) : (
          <Table variant="simple">
            <Thead bg="gray.100">
              <Tr>
                <Th>Email</Th>
                <Th>Status</Th>
                <Th>Created At</Th>
              </Tr>
            </Thead>
            <Tbody>
              {requests.map((r: any) => (
                <Tr key={r._id}>
                  <Td>{r.user.email}</Td>
                  <Td textTransform="capitalize">{r.status}</Td>
                  <Td>{new Date(r.createdAt).toLocaleString()}</Td>
                  <Td>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => navigate(`/admin/requests/${r._id}`)}
                    >
                      Xem chi tiết
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <HStack justify="center" mt={6}>
          <Button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            isDisabled={page === 1}
          >
            Prev
          </Button>
          <Text>
            Page {page} / {totalPages}
          </Text>
          <Button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            isDisabled={page === totalPages}
          >
            Next
          </Button>
        </HStack>
      )}
    </Box>
  );
}
