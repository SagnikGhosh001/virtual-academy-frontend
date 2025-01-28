import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPic, logout, offline, online } from "../reducer/AuthSlice";
import { useNavigate } from "react-router-dom"; // Importing useNavigate for redirection
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';

const pages = ["About","Contact Us", "Sem", "Dept", "Feedback"];
const registration = ["Register", "Login"];
const settings = ["Dashboard", "Profile", "Settings", "Logout"];

function CustomNavbar() {
  const { user, islogin } = useSelector((state) => state?.auth);

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [flaggetpic, setFlaggetpic] = React.useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {

    if (islogin && flaggetpic) {
      const fetchPic = async () => {
        try {
          const resultAction = await dispatch(getPic({ id: user?.id, gender: user?.gender }));
          const image = resultAction.payload;
          setImageUrl(image);
        } catch (error) {
          console.error('Failed to fetch picture:', error);
        }
      };
      fetchPic();
      setFlaggetpic(false);
    }
  }, [islogin, flaggetpic, dispatch, user?.id]);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    setFlaggetpic(true);
    navigate("/login");
  };

  const OnlineBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: '#44b700',
      color: '#44b700',
      borderRadius: '50%',
      height: '12px',  // Adjust size as needed
      width: '12px',   // Adjust size as needed
      border: `2px solid ${theme.palette.background.paper}`,
      top: 7,       // Fine-tune positioning
      left: 25,        // Fine-tune positioning
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    },
  }));

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Mobile Menu Icon (Move this to appear before logo/text on small screens) */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, marginLeft: "auto" }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">
                    <Link
                      to={`/${page.toLowerCase().replace(/\s/g, "")}`}
                      style={{ color: "black", textDecoration: "none" }}
                    >
                      {page}
                    </Link>
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Logo/Text for larger screens */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' }, // Hide on small screens, show on medium and up
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              // flexGrow: 1,
            }}
          >
            <Link to={"/"} style={{ color: "inherit", textDecoration: "none" }}>
              Virtual Academy
            </Link>
          </Typography>

          {/* Logo/Text for smaller screens */}
          <Typography
            variant="h5"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' }, // Show on small screens only
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              fontSize: '0.875rem'
            }}
          >
            <Link to={"/"} style={{ color: "inherit", textDecoration: "none" }}>
              {
                islogin ? "Virtual Academy" : "V Academy"
              }

            </Link>
          </Typography>

          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                <Link
                  to={`/${page.toLowerCase().replace(/\s/g, "")}`}
                  style={{ color: "white", textDecoration: "none" }}
                >
                  {page}
                </Link>
              </Button>
            ))}
          </Box>

          {/* User Menu (Avatar and Settings for logged-in users) */}
          {islogin ? (
            <Box sx={{ flexGrow: 0 }}>
              <OnlineBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant={user?.isonline ? 'dot' : 'standard'}
              ></OnlineBadge>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  {imageUrl ? (
                    <img src={imageUrl} alt="User Profile" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                  ) : (
                    <Avatar alt={user?.name} src="/static/images/avatar/2.jpg" />
                  )}
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => {
                      handleCloseUserMenu();
                      if (setting === "Logout") {
                        dispatch(offline(user?.id)).then(() => {
                          handleLogout();
                        })

                      }
                    }}
                  >
                    <Typography textAlign="center">
                      <Link
                        to={`user/${setting.toLowerCase()}`}
                        style={{ textDecoration: "none" }}
                      >
                        {setting}
                      </Link>
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ) : (
            <Box sx={{ flexGrow: 0, display: "flex" }}>
              {registration.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  <Link
                    to={`/${page.toLowerCase()}`}
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    {page}
                  </Link>
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default CustomNavbar;
