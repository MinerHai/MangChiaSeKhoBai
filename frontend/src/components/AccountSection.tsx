import {
  Avatar,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../router";
import { useAuth } from "../stores/useAuthStore";

const AccountSection = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Flex gap={3}>
        <Link to={ROUTES.LOGIN}>Đăng nhập</Link>
        <Link to={ROUTES.REGISTER}>Đăng kí</Link>
      </Flex>
    );
  }

  const handleLogout = async () => {
    await logout(); // gọi API + xoá state
    navigate(ROUTES.LOGIN, { replace: true }); // chuyển về login
  };

  return (
    <Menu>
      <MenuButton>
        <Flex align="center" gap={2}>
          <Avatar
            size="sm"
            src={user.avatar?.secure_url}
            name={user.username}
          />
          <Text fontWeight="600">{user.username}</Text>
        </Flex>
      </MenuButton>
      <MenuList>
        <MenuItem as={Link} to={ROUTES.PROFILE}>
          Hồ sơ
        </MenuItem>
        {user.role === "admin" && (
          <MenuItem as={Link} to={ROUTES.ADMIN}>
            Admin Dashboard
          </MenuItem>
        )}
        <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default AccountSection;
