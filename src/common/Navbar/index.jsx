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
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import { useAppStore } from "../../AppStore";
import { FaSignOutAlt, FaUser, FaPlug } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Badge, Button } from "antd";
import { AuthContext } from "../../context/AuthContext";
import Paper from "@mui/material/Paper";

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background: "linear-gradient(to right, #6FC276, #3F8E4D)",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
}));

export default function Navbar({}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const updateOpen = useAppStore((state) => state.updateOpen);
  const dopen = useAppStore((state) => state.dopen);
  const navigate = useNavigate();
  const { isLoggedIn, user, onLogout } = React.useContext(AuthContext);


  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
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
        vertical: "top",
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
      {/* <MenuItem onClick={handleMenuClose}>
        <FaUser style={{ marginRight: "10px", fontSize: "1rem" }} />
        Profile
      </MenuItem> */}
      <MenuItem onClick={handleLogout}>
        <FaSignOutAlt style={{ marginRight: "10px", fontSize: "1rem" }} />
        Logout
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {/* <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem> */}
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
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
              display: { xs: "none", sm: "block" },
              fontWeight: "bold",
              letterSpacing: "0.1rem",
            }}
          >
            Diva Server Management
          </Typography>

          <Box sx={{ flexGrow: 1 }} />
          {serverDetails && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Paper
                variant="outlined"
                sx={{
                  padding: "8px 16px",
                  borderColor: "white",
                  color: "white",
                  backgroundColor: alpha("#ffffff", 0.1),
                  boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.2)",
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  '&:hover': {
                    borderColor: "white",
                    backgroundColor: alpha("#ffffff", 0.2),
                  },
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    fontFamily: "Arial, sans-serif",
                    textAlign: "center",
                  }}
                >
                  Connected to {serverDetails.IPaddress}:{serverDetails.portNumber}
                </Typography>
              </Paper>
              <Button
                type="primary"
                onClick={handleDisconnect}
                icon={<FaPlug />}
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#f44336",
                  borderColor: "#f44336",
                }}
              >
                Disconnect
              </Button>
            </Box>
          )}
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {/* <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={1} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton> */}
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
