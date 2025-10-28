import { Image, Text, HStack, useColorModeValue } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import logoImg from "../assets/logo2.png";
const Logo = () => {
  const textColor = useColorModeValue("white", "whiteAlpha.900");

  return (
    <Link to="/" style={{ textDecoration: "none" }}>
      <HStack
        spacing={3}
        align="center"
        _hover={{ transform: "scale(1.05)" }}
        transition="0.2s ease"
      >
        <Image
          src={logoImg}
          alt="Logo"
          boxSize={{ base: "36px", md: "42px" }}
          borderRadius="full"
          shadow="md"
        />
        <Text
          fontSize={{ base: "lg", md: "xl" }}
          fontWeight="bold"
          color={textColor}
          letterSpacing="wide"
        >
          SmartWarehouse
        </Text>
      </HStack>
    </Link>
  );
};

export default Logo;
