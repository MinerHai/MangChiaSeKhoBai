import {
  Box,
  Flex,
  VStack,
  Text,
  Link as ChakraLink,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "../../router";

export default function AdminLayout() {
  const location = useLocation();

  const sidebarBg = useColorModeValue("gray.100", "gray.900");
  const headerBg = useColorModeValue("white", "gray.800");

  const menu = [
    { path: "/admin", label: "Dashboard" },
    { path: ROUTES.BLOG_ADD, label: "Blogs Add" },
    { path: ROUTES.ADMIN_REQUESTS, label: "Requests" },
    { path: "/admin/settings", label: "Settings" },
  ];

  return (
    <Flex
      direction="column"
      minH="100vh"
      bg={useColorModeValue("gray.50", "gray.800")}
      m={0}
      p={0}
      w="100%"
    >
      {/* Header */}
      <Flex
        as="header"
        bg={headerBg}
        px={6}
        py={3}
        shadow="sm"
        align="center"
        justify="space-between"
        borderBottomWidth="1px"
      >
        <Text fontSize="xl" fontWeight="bold">
          🚀 Admin Panel
        </Text>
      </Flex>

      {/* Body */}
      <Flex flex="1" overflow="hidden">
        {/* Sidebar */}
        <Box
          as="aside"
          w="250px"
          bg={sidebarBg}
          borderRightWidth="1px"
          p={5}
          overflowY="auto"
          h="100%"
        >
          <VStack align="stretch" spacing={2}>
            <Text fontSize="lg" fontWeight="semibold" mb={4}>
              Menu
            </Text>
            {menu.map((item) => {
              const active = location.pathname === item.path;
              return (
                <ChakraLink
                  as={Link}
                  to={item.path}
                  key={item.path}
                  px={3}
                  py={2}
                  borderRadius="md"
                  fontWeight={active ? "bold" : "medium"}
                  bg={active ? "teal.500" : "transparent"}
                  color={active ? "white" : "gray.700"}
                  _hover={{
                    textDecoration: "none",
                    bg: active ? "teal.600" : "gray.200",
                  }}
                >
                  {item.label}
                </ChakraLink>
              );
            })}
          </VStack>
        </Box>

        {/* Main content */}
        <Box flex="1" p={8} overflowY="auto">
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
}
