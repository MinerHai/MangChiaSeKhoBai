import { Box, Flex, useColorModeValue, Container } from "@chakra-ui/react";
import Logo from "../Logo";
import NavLinks from "./NavLinks";
import AccountSection from "../AccountSection";

const NavBar = () => {
  // màu chủ đạo: xanh dương công nghệ và xanh lá logistics
  const bgGradient = useColorModeValue(
    "linear(to-r, teal.400, blue.500, green.400)",
    "linear(to-r, teal.600, blue.700, green.600)"
  );

  return (
    <Box
      as="nav"
      position="fixed"
      top={0}
      left={0}
      width="100%"
      zIndex={999}
      bgGradient={bgGradient}
      boxShadow="lg"
      py={3}
    >
      <Container maxW="7xl">
        <Flex justify="space-between" align="center">
          <Logo />

          {/* Desktop links */}
          <Flex display={{ base: "none", md: "flex" }} align="center" gap={8}>
            <NavLinks />
          </Flex>

          <Flex align="center" gap={4}>
            <AccountSection />
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default NavBar;
