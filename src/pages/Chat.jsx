import React, { useState, useRef, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Avatar,
  TextField,
  Button,
  Menu,
  MenuItem,
  Box,
  Divider,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Alert,
} from "@mui/material";
import {
  Send,
  People,
  MoreVert,
  Edit,
  Delete,
  EmojiEmotions,
} from "@mui/icons-material";
import { Edit as EditIcon, Lock as LockIcon } from "@mui/icons-material";
import { ClickAwayListener } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled, useTheme } from "@mui/material/styles";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import CryptoJS from "crypto-js";
import { messagebyroomid } from "../reducer/MessageSlice";
import { editRoom, roombyRoomId } from "../reducer/RoomSLice";
import { getPic } from "../reducer/AuthSlice";
import WebSocketService from "../reducer/WebSocketService";
import { useForm } from "react-hook-form";
import { Modal, notification, Spin } from "antd";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import EmojiPicker from "emoji-picker-react";

const ChatContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  backgroundColor: "#f0f2f5",
});

const MessageContainer = styled("div")({
  flex: 1,
  overflowY: "auto",
  padding: "16px",
});

const MessageBubble = styled("div")(({ isCurrentUser }) => ({
  maxWidth: "70%",
  margin: "8px 0",
  padding: "12px 16px",
  borderRadius: "20px",
  backgroundColor: isCurrentUser ? "#0084ff" : "#fff",
  color: isCurrentUser ? "white" : "black",
  alignSelf: isCurrentUser ? "flex-end" : "flex-start",
  boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
  position: "relative",
  "@media (max-width: 600px)": {
    maxWidth: "90%", // Adjust for smaller screens
  },
}));

const Chat = () => {
  const [newMessage, setNewMessage] = useState("");
  const [isedit, setIsedit] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const messagesEndRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);
  const { messageroomid, loading } = useSelector((state) => state.message);

  const [showRoomEdit, setShowRoomEdit] = useState(false);

  const [editPassword, setEditPassword] = useState("");
  const { user } = useSelector((state) => state.auth);
  const {
    rooms,
    roomsbyid,
    roomsbyroomid,
    roomsbypartipentsid,
    roomsbycreatorid,
  } = useSelector((state) => state.room);
  const [messages, setMessages] = useState([]);
  const { roomId } = useParams();
  const secretKey = "virtualacademy";
  const decodedId = decodeURIComponent(roomId);
  const originalId = CryptoJS.AES.decrypt(decodedId, secretKey).toString(
    CryptoJS.enc.Utf8
  );
  const dispatch = useDispatch();
  const [userAvatars, setUserAvatars] = useState({});
  const [isPrivate, setIsPrivate] = useState(0);
  const [imageurl, setImageurl] = useState(0);
  const [singleimageurl, setSingleimageurl] = useState(0);
  const [participants, setParticipants] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedSkinTone, setSelectedSkinTone] = useState("neutral");
  const theme = useTheme();
  // Add this right after your other useEffect hooks
  // useEffect(() => {
  //     scrollToBottom();
  // },
  // [messages]); // This will trigger on every messages array change
  useEffect(() => {
    document.title = "Virtual Academy | Chat";
  }, []);

  // Your existing scroll function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  };
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  useEffect(() => {
    if (
      roomsbyroomid?.participants &&
      !roomsbyroomid.participants.some(
        (participant) => participant.id === user?.id
      )
    ) {
      navigate("/user/dashboard");
    }
  }, [roomsbyroomid, user, navigate]);
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    let token;
    try {
      const parsed = JSON.parse(storedToken);
      token = parsed.token; 
      if (!token) throw new Error("No token field in stored JSON");
    } catch (e) {
      console.error("Failed to parse token:", e);
      token = storedToken; 
    }
    if (!token) {
      console.error("No valid token available");
      return;
    }
    // const socket = new SockJS('http://localhost:9091/ws-chat');
    const socket = new SockJS(
    //   `https://troy-classroom-lowest-productivity.trycloudflare.com/ws-chat?Authorization=Bearer ${token}`
      `http://localhost:9091/ws-chat?Authorization=Bearer ${token}`
    );
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000, 
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      // debug: (str) => console.log('[WS]', str),
    });

    client.onConnect = () => {
      setErrorMessage(null);
      client.subscribe(`/topic/room/${originalId}`, (message) => {
        const received = JSON.parse(message?.body);
        if (
          !received ||
          (!received.content &&
            received.type !== "DELETE" &&
            received.type !== "JOIN" &&
            received.type !== "ROOMDELETE" &&
            received.type !== "LEAVE" &&
            received.type !== "KICK")
        ) {
          // console.log('Skipping invalid or empty message:', received);
          return;
        }
        // console.log('Received message:', received);
        setMessages((prev) => {
          if (received.type === "DELETE") {
            return prev.filter((msg) => msg.id !== received.id);
          }
          if (
            received.type === "ROOMDELETE" &&
            originalId === received.roomId
          ) {
            notification.success({
              message: "THis Room Has Been Deleted By It's Creator.",
            });
            navigate("/user/dashboard");
            return prev;
          }
          if (received.type === "LEAVE" && user?.id === received.userId) {
            notification.success({
              message: "You leave this room successfully.",
            });
            navigate("/user/dashboard");
            return prev;
          }
          if (received.type === "KICK" && user?.id === received.userId) {
            notification.error({
              message:
                "You are no longer in this room, creator kicked you out.",
            });
            navigate("/user/dashboard");
            return prev;
          }
          if (received.type === "KICK" && user?.id === received?.creatorId) {
            notification.success({
              message: "Participent deleted successfully.",
            });
            return prev;
          }
          const exists = prev.some((msg) => msg.id === received.id);
          if (exists) {
            return prev.map((msg) => (msg.id === received.id ? received : msg));
          }

          // Only add messages with actual content
          if (received.content) {
            return [...prev, received];
          }

          return prev;
        });
        // Handle Participants
        setParticipants((prev) => {
          // if (received.type === 'JOIN' && received.user) {
          //     if (!prev.some(p => p.id === received.user.id)) {
          //         return [...prev, received.user];
          //     }
          let newParticipants = [...prev];
          if (received.type === "JOIN" && received.user) {
            if (!prev.some((p) => p.id === received.user.id)) {
              newParticipants = [...prev, received.user];
              // Fetch avatar for the new participant
              fetchAvatarForUser(
                received.user.id,
                received.user.gender,
                userAvatars
              ).then((avatar) => {
                setUserAvatars((prevAvatars) => ({
                  ...prevAvatars,
                  [received.user.id]: avatar,
                }));
              });
            }
          } else if (received.type === "LEAVE" || received.type === "KICK") {
            newParticipants = prev.filter((p) => p.id !== received.userId);
          } else if (received.type === "UPDATE" && received.user) {
            newParticipants = prev.map((p) =>
              p.id === received.user.id ? received.user : p
            );
          }
          return newParticipants;
        });
      });
      client.subscribe("user/queue/errors", (message) => {
        // console.log(message);
        const errorMsg = message.body;
        setErrorMessage(errorMsg);
      });
    };

    client.onStompError = (frame) => {
      // console.error('STOMP error:', frame);
      setErrorMessage("Connection to chat server failed. Reconnecting...");
    };

    client.onWebSocketClose = () => {
      // console.warn('WebSocket closed');
      setErrorMessage("Chat server disconnected. Reconnecting...");
    };

    client.activate();
    setStompClient(client);

    return () => client.deactivate();
  }, [originalId, navigate, user?.id, userAvatars, dispatch]);

  const ensureConnected = (action) => {
    if (!stompClient || !stompClient.connected) {
      console.error("No STOMP connection available");
      notification.error({
        message: "Connection lost. Please wait or refresh the page.",
      });
      return false;
    }
    return true;
  };

  useEffect(() => {
    const fetchInitialMessages = async () => {
      try {
        const result = await dispatch(messagebyroomid(originalId));
        setMessages(result?.payload?.body);
        if (roomsbyroomid?.participants) {
          setParticipants(roomsbyroomid.participants);
        }
        await scrollToBottom();
      } catch (error) {
        console.error("Error fetching messages:", error);
        setErrorMessage("Failed to load initial messages.");
      }
    };
    fetchInitialMessages();
  }, [dispatch, originalId, roomsbyroomid]);
  const handleSendMessage = () => {
    if (!stompClient || !newMessage.trim()) return;

    if (!ensureConnected()) return;

    const messageDTO = {
      content: newMessage,
      senderId: user?.id,
      roomId: originalId,
      tempId: Date.now(),
    };

    if (isedit && selectedMessage) {
      // Edit existing message
      const editDTO = {
        id: selectedMessage.id,
        ...messageDTO,
      };
      stompClient.publish({
        destination: `/app/chat/${originalId}/edit`,
        body: JSON.stringify(editDTO),
      });
    } else {
      // Send new message
      stompClient.publish({
        destination: `/app/chat/${originalId}`,
        body: JSON.stringify(messageDTO),
      });
    }

    setNewMessage("");
    setIsedit(false);
    setAnchorEl(null);
  };
  const handleEmojiClick = (emojiObject) => {
    setNewMessage((prev) => prev + emojiObject.emoji);
  };
  //   const handleEmojiSelect = (emoji) => {
  //     setNewMessage((prev) => prev + emoji.native); // Append selected emoji to message
  //     setShowEmojiPicker(false); // Close picker after selection (optional)
  //   };
  const onSubmit = async (data) => {
    const payload = {
      ...data,
      creatorid: user?.id,
    };
    const res = await dispatch(
      editRoom({ id: originalId, userInput: payload })
    );

    if (res?.payload?.statusCodeValue === 200) {
      notification.success({ message: "Room Updated successfully!" });
      setShowRoomEdit(false);
      dispatch(roombyRoomId(originalId));
    }
  };

  const handleDeleteClick = () => {
    if (!stompClient) return;
    if (!ensureConnected()) return;
    Modal.confirm({
      title: "Are you sure you want to delete this room?",
      onOk: async () => {
        try {
          const deleteDTO = {
            creatorid: user?.id,
            roomId: originalId,
            type: "DELETE",
          };
          stompClient.publish({
            destination: `/app/room/${originalId}/delete`,
            body: JSON.stringify(deleteDTO),
            headers: { "content-type": "application/json" },
          });
          // setAnchorEl(null);
        } catch (error) {
          notification.error({ message: "Failed to delete room." });
        }
      },
    });
  };

  const handleLeaveRoom = () => {
    if (!stompClient) return;
    if (!ensureConnected()) return;
    Modal.confirm({
      title: "Are you sure you want to leave this room?",
      onOk: async () => {
        try {
          const leaveDTO = {
            joinid: user?.id,
            roomId: originalId,
            type: "LEAVE",
          };
          stompClient.publish({
            destination: `/app/room/${originalId}/leave`,
            body: JSON.stringify(leaveDTO),
            headers: { "content-type": "application/json" },
          });
        } catch (error) {
          notification.error({ message: "Failed to leave room." });
        }
      },
    });
  };
  const handleKickRoom = (id) => {
    if (!stompClient) return;
    if (!ensureConnected()) return;
    Modal.confirm({
      title: "Are you sure you want to kick this participent?",
      onOk: async () => {
        try {
          const leaveDTO = {
            creatorid: user?.id,
            joinid: id,
            roomId: originalId,
            type: "KICK",
          };
          stompClient.publish({
            destination: `/app/room/${originalId}/kick`,
            body: JSON.stringify(leaveDTO),
            headers: { "content-type": "application/json" },
          });
        } catch (error) {
          notification.error({ message: "Failed to delete this participent." });
        }
      },
    });
  };
  // Modified delete handler
  const handleDeleteMessage = () => {
    if (!stompClient || !selectedMessage) return;
    if (!ensureConnected()) return;

    const deleteDTO = {
      id: selectedMessage.id,
      roomId: originalId,
      senderId: user?.id,
      type: "DELETE",
    };
    setMessages((prev) => prev.filter((msg) => msg.id !== selectedMessage.id));
    stompClient.publish({
      destination: `/app/chat/${originalId}/delete`,
      body: JSON.stringify(deleteDTO),
      headers: { "content-type": "application/json" },
    });

    setAnchorEl(null);
  };
  const fetchPic = async (id, gender) => {
    try {
      const resultAction = await dispatch(getPic({ id: id, gender: gender }));
      const image = resultAction.payload;
      setImageurl(image);
      return image;
    } catch (error) {
      console.error("Failed to fetch picture:", error);
    }
  };
  const fetchAvatarForUser = async (id, gender, currentAvatars) => {
    if (currentAvatars[id]) return currentAvatars[id]; // Return cached avatar if exists
    try {
      const resultAction = await dispatch(getPic({ id, gender }));
      return resultAction.payload;
    } catch (error) {
      console.error(`Failed to fetch picture for user ${id}:`, error);
      return null; // Fallback to null or a default avatar
    }
  };

  useEffect(() => {
    const fetchSinglePic = async () => {
      try {
        const resultAction = await dispatch(
          getPic({ id: user?.id, gender: user?.gender })
        );
        const image = resultAction.payload;
        setSingleimageurl(image);
      } catch (error) {
        console.error("Failed to fetch picture:", error);
      }
    };
    fetchSinglePic();
    const fetchAvatars = async () => {
      if (!participants || !Array.isArray(participants)) return;
      const avatarMap = { ...userAvatars };

      for (const participant of participants) {
        if (!avatarMap[participant.id]) {
          avatarMap[participant.id] = await fetchPic(
            participant?.id,
            participant?.gender
          );
        }
      }

      setUserAvatars(avatarMap);
    };
    if (roomsbyroomid) {
      fetchAvatars();
    }
  }, [dispatch, participants, roomsbyroomid]);
  useEffect(() => {
    dispatch(roombyRoomId(originalId));
  }, [dispatch, originalId]);

  const handleEditMessage = () => {
    setIsedit(true);
    setNewMessage(selectedMessage?.content);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <ChatContainer>
      <AppBar position="static" color="inherit">
        <Toolbar
          sx={{
            flexWrap: "wrap",
            gap: 1,
            py: 1,
            minHeight: "64px",
          }}
        >
          <IconButton onClick={() => setShowParticipants(true)}>
            <People />
          </IconButton>
          {roomsbyroomid?.creator?.id === user?.id && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
                ml: { xs: 0, sm: 1 },
              }}
            >
              <IconButton
                onClick={() => {
                  setShowRoomEdit(true);
                  setValue("name", roomsbyroomid?.name);
                  setValue("description", roomsbyroomid?.description);
                  if (roomsbyroomid?.private) {
                    setIsPrivate(1);
                  }
                }}
                sx={{ color: "inherit" }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                onClick={() => {
                  handleDeleteClick();
                }}
                sx={{ ml: 0.5 }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
          <Stack
            sx={{
              flex: 1,
              minWidth: 0, // Allow text truncation
              ml: 1,
            }}
            onClick={() => setShowParticipants(true)}
          >
            <Typography
              variant="h6"
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: 1.2,
              }}
            >
              {roomsbyroomid?.roomId}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {roomsbyroomid?.name}
            </Typography>
          </Stack>

          <Chip
            sx={{
              flexShrink: 0,
              ml: "auto",
              maxWidth: { xs: "120px", sm: "none" },
            }}
            avatar={<Avatar src={singleimageurl} />}
            label={
              <Typography
                variant="body2"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.email}
              </Typography>
            }
            variant="outlined"
          />
          {roomsbyroomid?.creator?.id !== user?.id && (
            <IconButton
              onClick={() => {
                handleLeaveRoom();
              }}
              sx={{ ml: 0.5 }}
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {errorMessage && (
        <Box sx={{ p: 2 }}>
          <Alert severity="error" onClose={() => setErrorMessage(null)}>
            {errorMessage}{" "}
            <Button onClick={() => window.location.reload()}>Refresh</Button>
          </Alert>
        </Box>
      )}

      <Drawer
        anchor="left"
        open={showParticipants}
        onClose={() => setShowParticipants(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "80%", sm: "300px" }, // Responsive width
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Room Participants
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle1" gutterBottom>
            {roomsbyroomid?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {roomsbyroomid?.description}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <List>
            {participants?.map((participant) => (
              <ListItem
                key={participant.id}
                sx={{ display: "flex", alignItems: "center" }}
              >
                {roomsbyroomid?.creator?.id === user?.id && (
                  <IconButton
                    onClick={() => {
                      handleKickRoom(participant.id);
                    }}
                    sx={{ ml: 0.5 }}
                    color="error"
                    disabled={participant.id === roomsbyroomid?.creator?.id}
                  >
                    <PersonRemoveIcon fontSize="small" />
                  </IconButton>
                )}

                <Avatar
                  sx={{ mr: 2, width: 32, height: 32 }}
                  src={userAvatars[participant?.id]}
                />
                <ListItemText
                  primary={participant?.email}
                  secondary={participant?.role}
                  primaryTypographyProps={{
                    fontWeight:
                      participant?.id === user?.id ? "bold" : "normal",
                    style: {
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                  }}
                />
                {participant?.id === user?.id && (
                  <Chip label="You" size="small" color="primary" />
                )}
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <MessageContainer>
        {messages?.map((message) => (
          <MessageBubble
            key={message?.id}
            isCurrentUser={message?.sender?.id === user?.id}
            onContextMenu={(e) => {
              e.preventDefault();
              if (message?.sender?.id === user?.id) {
                setAnchorEl(e.currentTarget);
                setSelectedMessage(message);
              }
            }}
          >
            <Box display="flex" alignItems="center" mb={1}>
              <Avatar
                sx={{ width: 24, height: 24, mr: 1 }}
                src={userAvatars[message?.sender?.id]}
              ></Avatar>
              <Typography
                variant="subtitle2"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "200px", // Adjust based on your layout
                }}
              >
                {message?.sender?.id === user?.id
                  ? "You"
                  : message?.sender?.email}
              </Typography>
            </Box>
            <Typography variant="body1">{message?.content}</Typography>
            <Typography
              variant="caption"
              display="block"
              textAlign="right"
              mt={1}
            >
              {new Date(message?.timestamp).toLocaleTimeString()}
            </Typography>
            {message?.editedtimestamp && (
              <Typography
                variant="caption"
                display="block"
                textAlign="right"
                mt={1}
              >
                {new Date(message?.editedtimestamp).toLocaleTimeString()}
                {message?.isedited && (
                  <span
                    style={{
                      marginLeft: "8px",
                      color: "#666",
                      fontSize: "0.75rem",
                    }}
                  >
                    (edited)
                  </span>
                )}
              </Typography>
            )}
            {message?.sender?.id === user?.id && (
              <IconButton
                size="small"
                sx={{ position: "absolute", top: 4, right: 4 }}
                onClick={(e) => {
                  setAnchorEl(e.currentTarget);
                  setSelectedMessage(message);
                }}
              >
                <MoreVert fontSize="small" />
              </IconButton>
            )}
          </MessageBubble>
        ))}
        <div ref={messagesEndRef} />
      </MessageContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => {
          setAnchorEl(null); // Close the menu
          setTimeout(() => {
            // Optionally focus another element if needed
          }, 0);
        }}
      >
        <MenuItem onClick={handleEditMessage}>
          <Edit sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteMessage}>
          <Delete sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          bgcolor: "background.paper",
          boxShadow: 3,
          p: 2,
          zIndex: 1, // Ensure it stays above other content
        }}
      >
        {showEmojiPicker && (
            // <ClickAwayListener onClickAway={() => setShowEmojiPicker(false)}>
        <Box
            sx={{
              position: "absolute",
              bottom: 70,
              right: 10,
              zIndex: 10,
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: 3,
              overflow: "hidden",
              width: 350, // Fixed width to prevent resizing
              maxWidth: "90vw",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1, backgroundColor: "#f0f0f0" }}>
              <IconButton onClick={() => setShowEmojiPicker(false)} size="small" sx={{ p: 0 }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              skinTone={selectedSkinTone}
              onSkinToneChange={(tone) => setSelectedSkinTone(tone)}
              previewConfig={{ showPreview: true, defaultCaption: "Please Select an Emoji" }}
              searchPlaceholder="Search emojis"
              skinTonesDisabled={false}
              theme={theme.palette.mode}
              height={400}
              width="100%"
              skinTonePickerLocation="SEARCH"
            />
          </Box>
    //    </ClickAwayListener>
        )}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          InputProps={{
            startAdornment: (
              <IconButton
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                sx={{ mr: 1 }}
              >
                <EmojiEmotions />
              </IconButton>
            ),
            endAdornment: (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                startIcon={<Send />}
              >
                {!isedit ? "Send" : "Edit"}
              </Button>
            ),
          }}
        />
      </Box>

      <Dialog open={showRoomEdit} onClose={() => setShowRoomEdit(false)}>
        <DialogTitle>Edit Room Settings</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Room Name"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            multiline
          />
          <TextField
            fullWidth
            margin="dense"
            label="Description"
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
            multiline
            rows={3}
          />
          <FormControlLabel
            control={
              <Switch
                checked={isPrivate === 1}
                onChange={(e) => {
                  const value = e.target.checked ? 1 : 0;
                  setIsPrivate(value);
                  setValue("isprivate", value);
                  if (value === 0) {
                    setValue("password", "");
                  }
                }}
                color="primary"
              />
            }
            label="Private Room"
            sx={{ mt: 1 }}
          />
          {isPrivate === 1 && (
            <TextField
              fullWidth
              margin="dense"
              label="Please Give a New Password"
              type="password"
              {...register("password", { required: true })}
              error={!!errors.password}
              helperText={errors.password?.message}
              required
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRoomEdit(false)}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </ChatContainer>
  );
};

export default Chat;
