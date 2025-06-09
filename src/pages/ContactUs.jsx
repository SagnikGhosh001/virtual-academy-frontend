import React, { useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Link,
  Container,
  Paper,
} from "@mui/material";
import {
  Email,
  LinkedIn,
  GitHub,
  Instagram,
  Phone,
  Facebook,
} from "@mui/icons-material";
import { motion } from "framer-motion";

function ContactUs() {
  useEffect(() => {
    document.title = "Virtual Academy | Contact Us";
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1976d2, #42a5f5)",
          color: "white",
          py: { xs: 4, md: 6 }, // Responsive padding
          px: { xs: 2, md: 3 },
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "2rem", md: "3rem" }, // Responsive font size
              mb: 2,
            }}
          >
            Contact Us
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "1rem", md: "1.25rem" }, // Responsive font size
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            We're excited to connect with you! Reach out via your preferred
            platform below.
          </Typography>
        </motion.div>
      </Box>

      {/* Contact Options */}
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Paper
          elevation={4}
          sx={{
            p: { xs: 3, md: 4 }, // Responsive padding
            borderRadius: "16px",
            backgroundColor: "#ffffff",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: "bold",
                color: "#1e3c72",
                mb: 4,
                fontSize: { xs: "1.5rem", md: "2rem" }, // Responsive font size
              }}
            >
              Reach Out to Us
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="center"
              alignItems="center"
              spacing={{ xs: 3, sm: 4 }} // Responsive spacing
              sx={{ flexWrap: "wrap" }}
            >
              {/* Email */}
              <Link
                href="mailto:sagnikghosh904@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
                sx={{ textAlign: "center" }}
              >
                <IconButton
                  sx={{
                    color: "#1e3c72",
                    fontSize: { xs: "40px", md: "48px" }, // Responsive icon size
                    "&:hover": {
                      backgroundColor: "#e3f2fd",
                      transform: "scale(1.1)",
                    },
                    transition: "transform 0.3s ease-in-out",
                  }}
                >
                  <Email fontSize="inherit" />
                </IconButton>
                <Typography
                  variant="body1"
                  sx={{ mt: 1, color: "#555", fontSize: { xs: "0.9rem", md: "1rem" } }}
                >
                  Email
                </Typography>
              </Link>

              {/* Phone */}
              <Link
                href="tel:+1234567890" // Replace with actual phone number if needed
                underline="none"
                sx={{ textAlign: "center" }}
              >
                <IconButton
                  sx={{
                    color: "#1e3c72",
                    fontSize: { xs: "40px", md: "48px" },
                    "&:hover": {
                      backgroundColor: "#e3f2fd",
                      transform: "scale(1.1)",
                    },
                    transition: "transform 0.3s ease-in-out",
                  }}
                >
                  <Phone fontSize="inherit" />
                </IconButton>
                <Typography
                  variant="body1"
                  sx={{ mt: 1, color: "#555", fontSize: { xs: "0.9rem", md: "1rem" } }}
                >
                  Phone
                </Typography>
              </Link>

              {/* Facebook */}
              <Link
                href="https://www.facebook.com/share/14j9PJty2T/"
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
                sx={{ textAlign: "center" }}
              >
                <IconButton
                  sx={{
                    color: "#1e3c72",
                    fontSize: { xs: "40px", md: "48px" },
                    "&:hover": {
                      backgroundColor: "#e3f2fd",
                      transform: "scale(1.1)",
                    },
                    transition: "transform 0.3s ease-in-out",
                  }}
                >
                  <Facebook fontSize="inherit" />
                </IconButton>
                <Typography
                  variant="body1"
                  sx={{ mt: 1, color: "#555", fontSize: { xs: "0.9rem", md: "1rem" } }}
                >
                  Facebook
                </Typography>
              </Link>

              {/* LinkedIn */}
              <Link
                href="https://www.linkedin.com/in/sagnik-ghosh-445b86303/"
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
                sx={{ textAlign: "center" }}
              >
                <IconButton
                  sx={{
                    color: "#1e3c72",
                    fontSize: { xs: "40px", md: "48px" },
                    "&:hover": {
                      backgroundColor: "#e3f2fd",
                      transform: "scale(1.1)",
                    },
                    transition: "transform 0.3s ease-in-out",
                  }}
                >
                  <LinkedIn fontSize="inherit" />
                </IconButton>
                <Typography
                  variant="body1"
                  sx={{ mt: 1, color: "#555", fontSize: { xs: "0.9rem", md: "1rem" } }}
                >
                  LinkedIn
                </Typography>
              </Link>

              {/* GitHub */}
              <Link
                href="https://github.com/SagnikGhosh001"
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
                sx={{ textAlign: "center" }}
              >
                <IconButton
                  sx={{
                    color: "#1e3c72",
                    fontSize: { xs: "40px", md: "48px" },
                    "&:hover": {
                      backgroundColor: "#e3f2fd",
                      transform: "scale(1.1)",
                    },
                    transition: "transform 0.3s ease-in-out",
                  }}
                >
                  <GitHub fontSize="inherit" />
                </IconButton>
                <Typography
                  variant="body1"
                  sx={{ mt: 1, color: "#555", fontSize: { xs: "0.9rem", md: "1rem" } }}
                >
                  GitHub
                </Typography>
              </Link>

              {/* Instagram */}
              <Link
                href="https://www.instagram.com/sagnik_ghosh_01?igsh=MWk4NGdnOGl3YmxpeQ=="
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
                sx={{ textAlign: "center" }}
              >
                <IconButton
                  sx={{
                    color: "#1e3c72",
                    fontSize: { xs: "40px", md: "48px" },
                    "&:hover": {
                      backgroundColor: "#e3f2fd",
                      transform: "scale(1.1)",
                    },
                    transition: "transform 0.3s ease-in-out",
                  }}
                >
                  <Instagram fontSize="inherit" />
                </IconButton>
                <Typography
                  variant="body1"
                  sx={{ mt: 1, color: "#555", fontSize: { xs: "0.9rem", md: "1rem" } }}
                >
                  Instagram
                </Typography>
              </Link>
            </Stack>
          </motion.div>
        </Paper>
      </Container>

      {/* Footer Section */}
      <Box
        sx={{
          background: "rgb(86, 128, 206)",
          color: "white",
          py: 2,
          textAlign: "center",
          boxShadow: "0 -4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
        >
          © {new Date().getFullYear()} Virtual Academy | Let’s build the future
          of education together!
        </Typography>
      </Box>
    </Box>
  );
}

export default ContactUs;