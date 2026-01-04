import Card from "../Card/card";
import React from "react";
import { useState } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import CommentIcon from "@mui/icons-material/Comment";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import API from "../../utils/api";

const Post = ({ profile, item, personalData }) => {
  const [seeMore, setSeeMore] = useState(false);
  const [comment, setComment] = useState(false);
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(false);
  const [noOfLikes, setNoOfLikes] = useState(item?.likes.length);
  const [commentText, setCommentText] = useState("");

  const handleSendComment = async (e) => {
    e.preventDefault();
    if (commentText.trim().length === 0)
      return toast.error("Please enter comment");
    await API.post(
      `/api/comment`,
      { postId: item?._id, comment: commentText },
      { withCredentials: true }
    )
      .then((res) => {
        setComments([res.data.comment, ...comments]);
      })
      .catch((err) => {
        console.log(err);
        alert("something went worng");
      });
  };
  useEffect(() => {
    const selfId = personalData?._id;
    if (!selfId || !item?.likes) return;

    item.likes.map((like) => {
      if (like?.toString() === selfId?.toString()) {
        setLiked(true);
        return;
      } else {
        setLiked(false);
      }
    });
  });

  const handleLikeFunc = async () => {
    await API.post(
      "/api/post/likeDislike",
      { postId: item?._id },
      { withCredentials: true }
    )
      .then((res) => {
        if (liked) {
          setNoOfLikes((prev) => prev - 1);
          setLiked(false);
        } else {
          setLiked(true);
          setNoOfLikes((prev) => prev + 1);
        }
      })
      .catch((err) => {
        console.log(err);
        alert("something went worng");
      });
  };

  const handleCommentBoxOpenClose = async () => {
    if (comment) {
      // If already open, just close it
      setComment(false);
    } else {
      // If closed, open and fetch comments
      setComment(true);
      try {
        const resp = await API.get(`/api/comment/${item?._id}`);
        setComments(resp.data.comments);
      } catch (err) {
        console.log(err);
        alert("something went worng");
      }
    }
  };
  const copyToClipboard = async () => {
    try {
      let string = `http://localhost:5173/profile/${item?.id}/activities/${item?._id}`;
      await navigator.clipboard.writeText(string);
      toast.success("copied to clipboard");
    } catch (error) {
      console.log("Failed to copy", error);
    }
  };

  const desc = item?.desc;
  return (
    <Card padding={0}>
      <div className="flex gap-3 p-4">
        <Link
          to={`/profile/${item?.user?._id}`}
          className="w-12 h-12 rounded-4xl"
        >
          <img
            className="rounded-4xl w-12 h-12 border-white cursor-pointer"
            src={item?.user?.profilePic}
            alt=""
          />
        </Link>
        <div>
          <div className="text-lg font-semibold">{item?.user?.f_name}</div>
          <div className="text-xs text-gray-500">{item?.user?.headlines}</div>
        </div>
      </div>
      {
        <div className="text-md p-4 my-4 whitespace-pre-line flex-grow">
          {seeMore
            ? desc
            : desc?.length > 50
            ? `${desc.slice(0, 50)}...`
            : `${desc}`}
          {desc?.length < 50 ? null : (
            <span
              onClick={() => setSeeMore((prev) => !prev)}
              className="cursor-pointer text-blue-600"
            >
              {seeMore ? " See Less" : " See More"}
            </span>
          )}
        </div>
      }
      {item?.imageLink && (
        <>
          <div className="w-[100%] h-[150px] md:h-[300px]">
            <img
              className="w-full h-full object-contain"
              src={item?.imageLink}
              alt="post"
            />
          </div> 
          <span className="w-full mt-3 border-b border-neutral-300"/>
        </>
      )}
      <div className="my-2 p-4 flex justify-between items-center">
        <div className="flex gap-1 items-center">
          <ThumbUpIcon sx={{ color: "blue", fontSize: 15 }} />
          <div className="text-sm text-gray-600">{noOfLikes} Likes</div>
        </div>
        <div className="flex gap-1 items-center">
          <div className="text-sm text-gray-600">{item?.comments} Comments</div>
        </div>
      </div>
      {/*setComment( true ) */}
      {!profile && (
        <div className="flex p-1">
          <div
            onClick={handleLikeFunc}
            className="w-[33%] justify-center flex gap-2 items-center border-gray-100 p-2 cursor-pointer hover:bg-gray-100"
          >
            {liked ? (
              <ThumbUpOutlinedIcon sx={{ fontSize: 22, color: "blue" }} />
            ) : (
              <ThumbUpOutlinedIcon sx={{ fontSize: 22 }} />
            )}
            <span>{liked ? "Liked" : "Like"}</span>
          </div>
          <div
            onClick={handleCommentBoxOpenClose}
            className="w-[33%] justify-center flex gap-2 items-center border-gray-100 p-2 cursor-pointer hover:bg-gray-100"
          >
            <CommentIcon sx={{ fontSize: 22 }} /> <span>Comment</span>
          </div>
          <div
            onClick={copyToClipboard}
            className="w-[33%] justify-center flex gap-2 items-center border-gray-100 p-2 cursor-pointer hover:bg-gray-100"
          >
            <SendIcon sx={{ fontSize: 22 }} /> <span>Share</span>
          </div>
        </div>
      )}
      {/*comment section */}
      {comment && (
        <div className="p-4 w-full">
          <div className="flex gap-2 items-center">
            <img
              src={personalData?.profilePic}
              className="rounded-full w-12 h-12 border-2 border-white cursor-pointer"
            />

            <form className="w-full flex gap-2" onSubmit={handleSendComment}>
              <input
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder="Add a comment...."
                className="w-full border-1 py-3 px-5 rounded-3xl hover:bg-gray-100"
              />
              <button
                type="submit"
                className="cursor-pointer bg-blue-800 text-white rounded-3xl py-1 px-3"
              >
                Send
              </button>
            </form>
          </div>
          {/*other comments section */}
          <div className="w-full p-4">
            {comments.map((item, index) => {
              return (
                <div key={index} className="my-4">
                  <Link
                    to={`/profile/${item?.user?._id}`}
                    className="flex gap-2"
                  >
                    <img
                      className="rounded-full w-10 h-10 border-2 border-white cursor-pointer"
                      src={item?.user?.profilePic}
                      alt=""
                    />
                    <div className="cursor-pointer">
                      <div className="text-md">{item?.user?.f_name}</div>
                      <div className="text-sm text-gray-500">
                        {item?.user?.headlines}
                      </div>
                    </div>
                  </Link>
                  <div className="px-11 my-2">{item?.comment}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <ToastContainer />
    </Card>
  );
};

export default Post;
