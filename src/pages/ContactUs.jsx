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
import { Email, LinkedIn, GitHub, Instagram, Phone, Facebook } from "@mui/icons-material";
import { motion } from "framer-motion";

function ContactUs() {
  useEffect(() => {
      document.title = "Virtual Academy | Contact Us";
    }, []);
  return (
    <Box sx={{ textAlign: "center", backgroundColor: "#f4f6f8" }}>
      {/* Header Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1e3c72, #2a5298)",
          color: "white",
          py: 6,
          px: 3,
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h3" component="h1" gutterBottom>
            Get In Touch
          </Typography>
          <Typography variant="h6" gutterBottom>
            We'd love to hear from you! Reach out through any of the platforms
            below or drop us an email.
          </Typography>
        </motion.div>
      </Box>

      {/* Contact Options */}
      <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: "16px", backgroundColor: "#ffffff" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h4"
              component="h2"
              sx={{ fontWeight: "bold", mb: 3 }}
              color="primary"
            >
              Contact Options
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="center"
              spacing={6}
              sx={{ mt: 4 }}
            >
              {/* Email */}
              <Link
                href="mailto:sagnikghosh904@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
              >
                <IconButton
                  color="primary"
                  sx={{
                    fontSize: "48px",
                    "&:hover": { backgroundColor: "#e3f2fd", transform: "scale(1.1)" },
                    transition: "transform 0.3s ease-in-out",
                  }}
                >
                  <Email fontSize="inherit" />
                </IconButton>
                <Typography variant="body1" sx={{ mt: 1 }}>Email</Typography>
              </Link>

              {/* facebook */}
              <Link
                href="https://www.facebook.com/share/14j9PJty2T/" 
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
                // sx={{ color: "inherit" }}
              >
                <IconButton
                  color="primary"
                  sx={{
                    fontSize: "48px",
                    "&:hover": { backgroundColor: "#e3f2fd", transform: "scale(1.1)" },
                    transition: "transform 0.3s ease-in-out",
                  }}
                >
                  <Facebook fontSize="inherit" />
                </IconButton>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Facebook
                </Typography>
              </Link>
              {/* LinkedIn */}
              <Link
                href="https://www.linkedin.com/in/sagnik-ghosh-445b86303/"
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
              >
                <IconButton
                  color="primary"
                  sx={{
                    fontSize: "48px",
                    "&:hover": { backgroundColor: "#e3f2fd", transform: "scale(1.1)" },
                    transition: "transform 0.3s ease-in-out",
                  }}
                >
                  <LinkedIn fontSize="inherit" />
                </IconButton>
                <Typography variant="body1" sx={{ mt: 1 }}>LinkedIn</Typography>
              </Link>

              {/* GitHub */}
              <Link
                href="https://github.com/SagnikGhosh001"
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
              >
                <IconButton
                  color="primary"
                  sx={{
                    fontSize: "48px",
                    "&:hover": { backgroundColor: "#e3f2fd", transform: "scale(1.1)" },
                    transition: "transform 0.3s ease-in-out",
                  }}
                >
                  <GitHub fontSize="inherit" />
                </IconButton>
                <Typography variant="body1" sx={{ mt: 1 }}>GitHub</Typography>
              </Link>

              {/* Instagram */}
              <Link
                href="https://www.instagram.com/sagnik_ghosh_01?igsh=MWk4NGdnOGl3YmxpeQ=="
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
              >
                <IconButton
                  color="primary"
                  sx={{
                    fontSize: "48px",
                    "&:hover": { backgroundColor: "#e3f2fd", transform: "scale(1.1)" },
                    transition: "transform 0.3s ease-in-out",
                  }}
                >
                  <Instagram fontSize="inherit" />
                </IconButton>
                <Typography variant="body1" sx={{ mt: 1 }}>Instagram</Typography>
              </Link>
            </Stack>
          </motion.div>
        </Paper>
      </Container>

      {/* Footer Section */}
      <Box
        sx={{
          background: "#1e3c72",
          color: "white",
          py: 3,
          mt: 18,
          textAlign: "center",
          boxShadow: "0 -4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="body1">
          Thank you for connecting with Virtual Academy! We're here to help.
        </Typography>
      </Box>
    </Box>
  );
}

export default ContactUs;
