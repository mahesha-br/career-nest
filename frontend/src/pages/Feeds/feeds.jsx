import { useEffect, useState } from "react";
import ProfileCard from "../../components/ProfileCard/profileCard";
import Card from "../../components/Card/card";
import VideocamIcon from "@mui/icons-material/Videocam";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import ArticleIcon from "@mui/icons-material/Article";
import Advertisement from "../../components/Advertisement/advertisement";
import Post from "../../components/Post/post";
import Model from "../../components/Model/model";
import AddModel from "../../components/AddMdel/addModel";
import Loader from "../../components/Loader/loader";
import { ToastContainer, toast } from "react-toastify";
import API from "../../utils/api";

const Feeds = () => {
  const [personalData, setPersonalData] = useState(null);
  const [post, setPost] = useState([]);
  const [addPostMOdel, setAddPostModel] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [userData, postData] = await Promise.all([
        API.get("/api/auth/self", { withCredentials: true }),
        API.get("/api/post/getAllPost"),
      ]);

      setPersonalData(userData.data.user);
      localStorage.setItem("userInfo", JSON.stringify(userData.data.user));
      setPost(postData.data.posts);
    } catch (err) {
      console.log("API error:", err);
      toast.error(err?.response?.data?.error);
      if (err?.response?.data?.error === "No token,authorization denied") {
        localStorage.setItem("isLogin", "false");
      }
    } finally {
      setIsLoading(false); // stop loading after API call
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenPostModel = () => {
    setAddPostModel((prev) => !prev);
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[78vh] flex items-center justify-center">
        <Loader /> {/* show loader while data is fetching */}
      </div>
    );
  }

  return (
    <div className="px-5 xl:px-10 py-8 flex gap-5 min-h-[78.1vh] md:min-h-[89vh] w-full mt-5 md:mt-8 bg-gray-100">
      {/* left side */}
      <div className="w-[21%] sm:block sm:w-[23%] hidden py-5">
        <div className="h-fit">
          <ProfileCard data={personalData} />
        </div>

        <div className="w-full my-5">
          <Card padding={1}>
            <div className="w-full flex justify-between">
              <div>Profile Viewers</div>
              <div className="text-blue-800">23</div>
            </div>
            <div>
              <div className="w-full flex justify-between">
                <div>Post Impressions</div>
                <div className="text-blue-800">80</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* middle side */}
      <div className="w-[100%] md:w-[80%] py-5 sm:-[50%]">
        <div>
          <Card padding={1}>
            <div className="flex gap-2 items-center">
              <img
                src={personalData?.profilePic}
                alt="profile pic"
                className="rounded-4xl w-13 h-13 border-white cursor-pointer"
              />
              <div
                onClick={() => setAddPostModel(true)}
                className="w-full border-1 py-3 px-3 rounded-3xl cursor-pointer hover:bg-gray-100"
              >
                Start a post
              </div>
            </div>

            <div className="w-full flex mt-3">
              <div
                onClick={() => setAddPostModel(true)}
                className="flex gap-2 p-2 cursor-pointer justify-center rounded-lg w-[35%] hover:bg-gray-100"
              >
                <VideocamIcon sx={{ color: "green" }} />
                Video
              </div>
              <div
                onClick={() => setAddPostModel(true)}
                className="flex gap-2 p-2 cursor-pointer justify-center rounded-lg w-[35%] hover:bg-gray-100"
              >
                <InsertPhotoIcon sx={{ color: "blue" }} />
                Photo
              </div>
              <div
                onClick={() => setAddPostModel(true)}
                className="flex gap-2 p-2 cursor-pointer justify-center rounded-lg w-[35%] hover:bg-gray-100"
              >
                <ArticleIcon sx={{ color: "orange" }} />
                Artical
              </div>
            </div>
          </Card>
        </div>

        <div className="border-b-1 border-gray-400 w-[100%] my-5" />

        <div className="w-full flex flex-col gap-5">
          {post.map((item, index) => (
            <Post item={item} key={index} personalData={personalData} />
          ))}
        </div>
      </div>

      {/* right side */}
      <div className="w-[26%] py-5 hidden md:block">
        <div>
          <Card padding={1}>
            <div className="text-xl">CarrerNest News</div>
            <div className="text-gray-600">Top stories</div>
            <div className="my-1">
              <div className="text:md">Buffett to remain Berkshire chair</div>
              <div className="text-xs text-gray-300">2h ago</div>
            </div>
            <div className="my-1">
              <div className="text:md">Foreign investments surge again</div>
              <div className="text-xs text-gray-300">3h ago</div>
            </div>
          </Card>
        </div>
        <div className="my-5 sticky top-19">
          <Advertisement />
        </div>
      </div>

      {addPostMOdel && (
        <Model closeModel={handleOpenPostModel} title="">
          <AddModel personalData={personalData} />
        </Model>
      )}
      <ToastContainer />
    </div>
  );
};

export default Feeds;
