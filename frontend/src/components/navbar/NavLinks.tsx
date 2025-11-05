import { HStack, Link, useColorModeValue } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { ROUTES } from "../../router";
const NavLinks = () => {
  const linkColor = useColorModeValue("whiteAlpha.900", "whiteAlpha.900");
  const hoverColor = useColorModeValue("yellow.200", "teal.200");

  const links = [
    { name: "Trang chủ", path: "/" },
    { name: "Kho hàng", path: ROUTES.WAREHOUSES },
    { name: "Giới thiệu", path: "/about" },
    { name: "Liên hệ", path: "/contact" },
    { name: "Kho hàng của tôi", path: ROUTES.USER_WAREHOUSES },
    { name: "Hợp đồng của tôi", path: ROUTES.USER_CONTRACT },
  ];

  return (
    <HStack spacing={6}>
      {links.map((link) => (
        <Link
          as={NavLink}
          key={link.path}
          to={link.path}
          fontWeight="medium"
          fontSize="md"
          color={linkColor}
          _hover={{
            textDecoration: "none",
            color: hoverColor,
            transform: "translateY(-1px)",
          }}
          _activeLink={{
            borderBottom: "2px solid",
            borderColor: hoverColor,
            color: hoverColor,
          }}
          transition="all 0.2s ease-in-out"
        >
          {link.name}
        </Link>
      ))}
    </HStack>
  );
};

export default NavLinks;
