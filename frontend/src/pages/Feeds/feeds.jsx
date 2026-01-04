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
      setIsLoading(false);
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
        <FeedsSkeleton />
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


const FeedsSkeleton = () => {
  return (
    <div className="px-5 xl:px-10 py-8 flex gap-5 min-h-[78.1vh] md:min-h-[89vh] w-full mt-5 md:mt-14 bg-gray-100 animate-pulse">
      

      <div className="w-[21%] sm:block sm:w-[23%] hidden py-5 md:flex flex-col gap-5">
        <div className="h-40 bg-gray-300 rounded-xl" />
        <div className="h-24 bg-gray-300 rounded-xl" /> 
      </div>

      <div className="w-[100%] md:w-[80%] flex flex-col gap-5">
        <div className="h-20 bg-gray-300 rounded-xl" /> 

        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white p-5 rounded-xl flex flex-col gap-3 shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-300 rounded-full" />
              <div className="flex-1 h-4 bg-gray-300 rounded" />
            </div>
            <div className="h-4 bg-gray-300 rounded w-full" />
            <div className="h-4 bg-gray-300 rounded w-5/6" />
            <div className="h-40 bg-gray-300 rounded" /> 
          </div>
        ))}
      </div>

      <div className="w-[26%] py-5 hidden md:flex flex-col gap-5">
        <div className="h-24 bg-gray-300 rounded-xl" /> 
        <div className="h-64 bg-gray-300 rounded-xl" />
      </div>
    </div>
  );
};

