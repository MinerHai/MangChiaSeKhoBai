// Layout.tsx
import { Outlet } from "react-router-dom";
import { Box, Container } from "@chakra-ui/react";
import NavBar from "../components/navbar/NavBar";
import Footer from "../components/Footer";

const Layout = () => {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      {/* Header */}
      <NavBar />

      {/* Body */}
      <Box as="main" flex="1" pt="50px">
        <Container maxW="container.xl">
          <Outlet />
        </Container>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default Layout;
