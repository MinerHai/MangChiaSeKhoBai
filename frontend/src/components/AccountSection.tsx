import {
  Avatar,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useAuth } from "../stores/useAuthStore";
import { ROUTES } from "../router";

const AccountSection = () => {
  const { user, clearUser } = useAuth();

  if (!user) {
    return (
      <>
        <Link to={ROUTES.LOGIN}>Login</Link>
        <Link to={ROUTES.REGISTER}>Register</Link>
      </>
    );
  }

  return (
    <Menu>
      <MenuButton>
        {user.avatar?.secure_url && (
          <Flex align="center" gap={2}>
            <Avatar size="sm" src={user.avatar?.secure_url} />
            <Text fontWeight="600">{user.username}</Text>
          </Flex>
        )}
        {!user.avatar?.secure_url && <Avatar size="sm" name={user.username} />}
      </MenuButton>
      <MenuList>
        <MenuItem as={Link} to={ROUTES.PROFILE}>
          Profile
        </MenuItem>
        <MenuItem onClick={clearUser} as={Link} to={ROUTES.LOGIN}>
          {" "}
          Logout
        </MenuItem>
        {user.role === "admin" && (
          <MenuItem as={Link} to={ROUTES.ADMIN}>
            Admin Dashboard
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
};

export default AccountSection;
