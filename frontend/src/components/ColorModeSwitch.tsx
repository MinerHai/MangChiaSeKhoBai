import { HStack, Switch, Text, useColorMode } from "@chakra-ui/react";
// useColorMode là hook của Chakra UI
const ColorModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <HStack>
      <Switch
        colorScheme="green"
        isChecked={colorMode === "dark"}
        onChange={toggleColorMode}
      />
      <Text whiteSpace={"nowrap"}>Dark Mode</Text>
    </HStack>
  );
};

export default ColorModeSwitch;
