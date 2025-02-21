import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function About() {
  useEffect(() => {
      document.title = "Virtual Academy | About";
    }, []);
  const { islogin } = useSelector((state) => state.auth);
  const navigate = useNavigate()
  return (
    <Box sx={{ fontFamily: "Roboto, sans-serif", textAlign: "center" }}>
      {/* Header Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #673ab7, #9575cd)",
          color: "white",
          py: 8,
          px: 2,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h2" sx={{ fontWeight: "bold", mb: 2 }}>
            About Virtual Academy
          </Typography>
          <Typography variant="h5" sx={{ mb: 4 }}>
            Empowering educational institutions with innovative solutions for
            online teaching and management.
          </Typography>
        </motion.div>
      </Box>

      {/* Vision Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", mb: 4, color: "#673ab7" }}
          >
            Our Vision
          </Typography>
          <Typography
            variant="body1"
            sx={{ lineHeight: 1.8, color: "#555", mb: 4 }}
          >
            At Virtual Academy, we aim to revolutionize the way education is
            managed. By bridging the gap between technology and traditional
            teaching methods, we empower educators and students to achieve
            excellence in a digitally connected world.
          </Typography>
        </motion.div>
      </Container>

      {/* What We Offer Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", mb: 4, color: "#673ab7" }}
          >
            What We Offer
          </Typography>
          <Grid container spacing={4}>
            {[
              "A platform for seamless online attendance, assignments, and syllabus management.",
              "Role-based access control for personalized features.",
              "Secure data management with encrypted passwords and OTP verification.",
              "Comprehensive feedback system for platform improvement.",
              "Topic-wise resources and syllabus uploads for streamlined learning.",
              "Interactive chat rooms, public or private, for real-time collaboration and discussion.",
            ].map((item, index) => (
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
                        variant="body1"
                        sx={{ lineHeight: 1.5, color: "#555" }}
                      >
                        {item}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* Target Audience Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", mb: 4, color: "#673ab7" }}
          >
            Our Target Audience
          </Typography>
          <Typography
            variant="body1"
            sx={{ lineHeight: 1.8, color: "#555", mb: 4 }}
          >
            Virtual Academy is designed for college institutions that aim to
            blend online and offline services. Whether you're a teacher, student,
            or administrator, our platform provides tailored tools for your
            needs.
          </Typography>
        </motion.div>
      </Container>

      {/* Footer Section */}
      <Box
        sx={{
          backgroundColor: "#673ab7",
          color: "white",
          py: 3,
        }}
      >
        <Typography variant="body1" sx={{ mb: 2 }}>
          Ready to transform the teaching experience? Join us at Virtual Academy.
        </Typography>
        <motion.div whileHover={{ scale: 1.1 }}>
          {islogin ? <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: "white",
              color: "#673ab7",
              "&:hover": { backgroundColor: "#ede7f6" },
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
                color: "#673ab7",
                "&:hover": { backgroundColor: "#ede7f6" },
              }}
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
          }
        </motion.div>
      </Box>
    </Box>
  );
}
