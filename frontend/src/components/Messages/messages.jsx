import { useEffect, useRef, useState } from "react";
import Card from "../Card/card";
import Conversation from "../Conversation/conversation";
import Advertisement from "../Advertisement/advertisement";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ImageIcon from "@mui/icons-material/Image";
import API from "../../utils/api";
import { Link } from "react-router-dom";

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [imageLink, setImageLink] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);

  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const ownData = JSON.parse(localStorage.getItem("userInfo"));
  const bottomRef = useRef(null);

  useEffect(() => {
    const loadConversations = async () => {
      setIsLoadingConversations(true);
      try {
        const res = await API.get("/api/conversation/get-conversation");
        const convs = res.data?.conversations || [];
        setConversations(convs);

        if (convs.length) handleSelectConversation(convs[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingConversations(false);
      }
    };

    loadConversations();
  }, []);

  useEffect(() => {
    if (!activeConvId) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      setIsLoadingMessages(true);
      try {
        const res = await API.get(`/api/message/${activeConvId}`);
        setMessages(res.data?.messages || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadMessages();
  }, [activeConvId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectConversation = (conv) => {
    setActiveConvId(conv._id);
    const otherUser = conv.members.find((m) => m._id !== ownData?._id);
    setSelectedUser(otherUser);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() && !imageLink) return;

    try {
      const res = await API.post("/api/message", {
        conversation: activeConvId,
        message: messageText,
        picture: imageLink,
      });

      setMessages((prev) => [...prev, res.data.message]);
      setMessageText("");
      setImageLink(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = null;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "careerNest");

    setLoadingImage(true);
    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dlvaadqgr/image/upload",
        { method: "POST", body: data }
      ).then((res) => res.json());

      setImageLink(res.secure_url);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingImage(false);
    }
  };

  const renderConversationSkeleton = () => {
    return [...Array(5)].map((_, i) => (
      <div
        key={i}
        className="h-16 mt-4 w-[90%] mx-auto bg-gray-300 rounded-xl animate-pulse mb-3"
      />
    ));
  };

  const renderMessageSkeleton = () => {
    return [...Array(6)].map((_, i) => {
      const isOwn = i % 2 === 0;
      return (
        <div
          key={i}
          className={`flex mb-3 ${
            isOwn ? "justify-end" : "justify-start"
          } items-end`}
        >
          <div
            className={`px-20 py-2 rounded-xl bg-gray-300 animate-pulse text-sm`}
            style={{ maxWidth: `${Math.random() * 30 + 40}%` }}
          >
            &nbsp;
          </div>
        </div>
      );
    });
  };

  return (
    <div className="bg-gray-100 mt-14 min-h-[70vh] px-4 xl:px-10 py-6">
      <div className="flex gap-5">
        <div className="w-full md:w-[30%]">
          <Card padding={0}>
            <div className="px-4 py-3 border-b font-semibold text-lg">
              Messaging
            </div>

            <div className="h-[72vh] overflow-y-auto">
              {isLoadingConversations ? (
                renderConversationSkeleton()
              ) : conversations.length === 0 ? (
                <p className="text-center text-gray-500 mt-5">
                  No conversations yet.
                </p>
              ) : (
                conversations.map((conv) => (
                  <Conversation
                    key={conv._id}
                    item={conv}
                    ownData={ownData}
                    activeConvId={activeConvId}
                    handleSelectedConv={() => handleSelectConversation(conv)}
                  />
                ))
              )}
            </div>
          </Card>
        </div>

        <div className="hidden md:flex md:w-[45%]">
          <Card padding={0} className="flex flex-col h-[85vh]">
            <div className="flex justify-between px-4 py-3 border-b">
              <div>
                <p className="font-semibold text-sm">
                  {selectedUser?.f_name || "Select a conversation"}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedUser?.headlines}
                </p>
              </div>
              <MoreHorizIcon />
            </div>

            <div className="flex-1 overflow-y-auto max-h-[64vh] px-4 py-4 bg-gray-50">
              {isLoadingMessages ? (
                renderMessageSkeleton()
              ) : messages.length === 0 ? (
                <>
                  <p className="text-center text-gray-500 mt-5">
                    No messages yet. Start the conversation! <br />
                    Use above search to find friends.
                  </p>
                  <div className="w-full flex items-center my-2">
                    <Link to="/myNetwork" className="mx-auto">
                      <button className="px-4 py-1.5 mx-auto cursor-pointer rounded-full text-sm text-white bg-blue-600">
                        Add friends
                      </button>
                    </Link>
                  </div>
                </>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.sender?._id === ownData?._id;

                  return (
                    <div
                      key={msg._id}
                      className={`flex mb-3 ${
                        isOwn ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`px-4 py-2 rounded-xl text-sm max-w-[70%] ${
                          isOwn ? "bg-blue-600 text-white" : "bg-white shadow"
                        }`}
                      >
                        {msg.message}
                        {msg.picture && (
                          <img
                            src={msg.picture}
                            alt="chat"
                            className="mt-2 rounded-md max-w-full"
                          />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            <div className="border-t p-3 flex gap-3 items-center bg-white">
              <label htmlFor="imgUpload" className="cursor-pointer">
                <ImageIcon />
              </label>
              <input
                type="file"
                id="imgUpload"
                hidden
                onChange={handleImageUpload}
              />

              <textarea
                rows={1}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Write a message..."
                className="flex-1 resize-none bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
              />

              <button
                onClick={handleSendMessage}
                disabled={loadingImage || (!messageText && !imageLink)}
                className={`px-4 py-1.5 rounded-full text-sm text-white ${
                  loadingImage || (!messageText && !imageLink)
                    ? "bg-gray-400"
                    : "bg-blue-600"
                }`}
              >
                Send
              </button>
            </div>
          </Card>
        </div>

        <div className="hidden lg:block lg:w-[25%]">
          <div className="sticky top-20">
            <Advertisement />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
