import React from "react";
import {
  Box,
  Spinner,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

interface FullScreenLoaderProps {
  message?: string;
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
  message = "Đang tải...",
}) => {
  const bgColor = useColorModeValue(
    "rgba(255, 255, 255, 0.8)",
    "rgba(0, 0, 0, 0.6)"
  );

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100vw"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={bgColor}
      backdropFilter="blur(4px)"
      zIndex={9999}
      pointerEvents="auto"
    >
      <VStack spacing={4}>
        <Spinner
          thickness="5px"
          speed="0.7s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
        <Text
          fontSize="lg"
          fontWeight="semibold"
          color={useColorModeValue("gray.700", "gray.200")}
        >
          {message}
        </Text>
      </VStack>
    </Box>
  );
};

export default FullScreenLoader;
