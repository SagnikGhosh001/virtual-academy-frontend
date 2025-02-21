import React, { useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import { Facebook, Twitter, LinkedIn, Instagram, Email } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Home() {
  useEffect(() => {
    document.title = "Virtual Academy | Home";
  }, []);
  const { islogin } = useSelector((state) => state.auth);
  const navigate = useNavigate()
  return (
    <Box sx={{ fontFamily: "Roboto, sans-serif", textAlign: "center" }}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8 }}
      >
        <Box
          sx={{
            background: "linear-gradient(135deg, #2196f3, #6ec1e4, #4fc3f7)",
            backgroundSize: "400% 400%",
            color: "white",
            py: 8,
            px: 2,
            animation: "gradientBG 8s ease infinite",
          }}
        >
          <Typography variant="h2" sx={{ fontWeight: "bold", mb: 2 }}>
            Welcome to Virtual Academy
          </Typography>
          <Typography variant="h5" sx={{ mb: 4 }}>
            Your one-stop solution for managing the teaching process online.
          </Typography>
          <motion.div whileHover={{ scale: 1.1 }}>
            {islogin ? <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "white",
                color: "#2196f3",
                "&:hover": { backgroundColor: "#e3f2fd" },
              }}
              onClick={() => navigate('/user/dashboard')}
            >
              View Dashboard
            </Button> :
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: "white",
                  color: "#2196f3",
                  "&:hover": { backgroundColor: "#e3f2fd" },
                }}
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
            }
          </motion.div>
        </Box>
      </motion.div>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", mb: 4, color: "#2196f3" }}
          >
            Why Choose Virtual Academy?
          </Typography>
        </motion.div>
        <Grid container spacing={4}>
          {[
            {
              title: "Seamless Attendance",
              description:
                "Easily track and manage student attendance with semester-wise and department-wise organization.",
            },
            {
              title: "Assignment Management",
              description:
                "Upload, manage, and review assignments with a streamlined process.",
            },
            {
              title: "Notes & Resources",
              description:
                "Access topic-wise notes and syllabi, all uploaded by experienced teachers.",
            },
            {
              title: "Marks Management",
              description:
                "Track and analyze students' academic performance with detailed marks records.",
            },
            {
              title: "Feedback System",
              description:
                "Provide valuable feedback to enhance your learning experience and improve the platform.",
            },
            {
              title: "Interactive Chat Rooms",
              description:
                "Create public or private chat rooms to collaborate, discuss, and connect with others in real time.",
            },
            {
              title: "Secure Access",
              description:
                "Role-based access control, encrypted passwords, and OTP verification ensure data security.",
            },
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    p: 2,
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    borderRadius: "16px",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 1,
                        color: "#2196f3",
                        fontWeight: "bold",
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#666" }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer Section */}
      <Box
        sx={{
          backgroundColor: "#2196f3",
          color: "white",
          py: 3,
        }}
      >
        <Typography variant="body1" sx={{ mb: 2 }}>
          Join Virtual Academy and revolutionize the way we manage education!
        </Typography>
        <Box>
          <IconButton
            sx={{ color: "white", mx: 1 }}
            href="https://www.facebook.com/share/14j9PJty2T/"
            target="_blank"
          >
            <Facebook />
          </IconButton>
          <IconButton
            sx={{ color: "white", mx: 1 }}
             href="mailto:sagnikghosh904@gmail.com"
            target="_blank"
          >
            <Email />
          </IconButton>
          <IconButton
            sx={{ color: "white", mx: 1 }}
            href="https://www.linkedin.com/in/sagnik-ghosh-445b86303/"
            target="_blank"
          >
            <LinkedIn />
          </IconButton>
          <IconButton
            sx={{ color: "white", mx: 1 }}
            href="https://www.instagram.com/sagnik_ghosh_01?igsh=MWk4NGdnOGl3YmxpeQ=="
            target="_blank"
          >
            <Instagram />
          </IconButton>
        </Box>
      </Box>

      {/* Keyframes for Background Animation */}
      <style>
        {`
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        `}
      </style>
    </Box>
  );
}
