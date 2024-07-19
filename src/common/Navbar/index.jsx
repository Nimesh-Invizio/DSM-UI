import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useAppStore } from "../../AppStore";
import { FaSignOutAlt, FaPlug, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Button, Avatar, Tooltip } from "antd";
import { AuthContext } from "../../context/AuthContext";
import Paper from "@mui/material/Paper";
import { Divider } from "@mui/material";

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background: "linear-gradient(to right, #6FC276, #3F8E4D)",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(0, 2),
  minHeight: 64,
}));

const LogoSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
}));

const UserSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

export default function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const updateOpen = useAppStore((state) => state.updateOpen);
  const dopen = useAppStore((state) => state.dopen);
  const navigate = useNavigate();
  const { isLoggedIn, user, onLogout } = React.useContext(AuthContext);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    onLogout();
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const handleDisconnect = () => {
    localStorage.removeItem('serverDetails');
    navigate("/server", { replace: true });
  };

  const serverDetails = localStorage.getItem('serverDetails') ? JSON.parse(localStorage.getItem('serverDetails')) : null;

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        <FaUser style={{ marginRight: "10px", fontSize: "1rem" }} />
        {user?.username}
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <Typography variant="body2" color="textSecondary">
          {user?.email}
        </Typography>
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>
        <FaSignOutAlt style={{ marginRight: "10px", fontSize: "1rem" }} />
        Logout
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <StyledToolbar>
          <LogoSection>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
              onClick={() => updateOpen(!dopen)}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                fontWeight: "bold",
                letterSpacing: "0.1rem",
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              Diva Server Management
            </Typography>
          </LogoSection>

          <UserSection>
           

            {serverDetails && (
              <Tooltip title="Server Name">
                <Paper
                  elevation={0}
                  sx={{
                    padding: "4px 12px",
                    backgroundColor: alpha("#ffffff", 0.1),
                    borderRadius: "20px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontFamily: "Arial, sans-serif",
                    }}
                  >
                    {serverDetails.pathName}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontFamily: "Arial, sans-serif",
                    }}
                  >
                    {serverDetails.pathname}
                  </Typography>
                </Paper>
              </Tooltip>

            )}
             {serverDetails && (
              <Tooltip title="Connected Server">
                <Paper
                  elevation={0}
                  sx={{
                    padding: "4px 12px",
                    backgroundColor: alpha("#ffffff", 0.1),
                    borderRadius: "20px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontFamily: "Arial, sans-serif",
                    }}
                  >
                    {serverDetails.IPaddress}:{serverDetails.portNumber}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontFamily: "Arial, sans-serif",
                    }}
                  >
                    {serverDetails.pathname}
                  </Typography>
                </Paper>
              </Tooltip>

            )}
            {serverDetails && (
              <Tooltip title="Disconnect">
                <Button
                  type="primary"
                  onClick={handleDisconnect}
                  icon={<FaPlug />}
                  size="small"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: alpha("#f44336", 0.8),
                    borderColor: "#f44336",
                  }}
                />
              </Tooltip>
            )}
            <Tooltip title="Account settings">
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar size="small" src={user?.avatar} alt={user?.name}>
                  {user?.name ? user.name[0].toUpperCase() : <AccountCircle />}
                </Avatar>
              </IconButton>
            </Tooltip>
          </UserSection>
        </StyledToolbar>
      </AppBar>
      {renderMenu}
    </Box>
  );
}