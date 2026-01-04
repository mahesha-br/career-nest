import React, { useState, useEffect } from "react";
import "./navbar2.css";
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import MessageIcon from "@mui/icons-material/Message";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MenuIcon from "@mui/icons-material/Menu";
import ClearIcon from "@mui/icons-material/Clear";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import API from "../../utils/api";

const Navbar2 = () => {
  //const [ dropdown, setDropDOwn ] = useState( false );
  const location = useLocation();

  const [userData, setUserData] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [searchUser, setSearchUser] = useState([]);
  const [notificationCount, setNotificationCount] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedTerm) {
      searchAPICall();
    }
  }, [debouncedTerm]);

  const searchAPICall = async () => {
    await API.get(`/api/auth/findUser?query=${debouncedTerm}`, {
      withCredentials: true,
    })
      .then((res) => {
        console.log(res);

        setSearchUser(res.data.users);
      })
      .catch((err) => {
        console.log(err);
        alert(err?.response?.data?.error);
      });
  };

  const fetchNotification = async () => {
    await API.get("/api/notification/activeNotification", {
      withCredentials: true,
    })
      .then((res) => {
        var count = res.data.count;
        setNotificationCount(count);
      })
      .catch((err) => {
        console.log(err);
        alert(err?.response?.data?.error);
      });
  };

  useEffect(() => {
    const userData = localStorage.getItem("userInfo");
    setUserData(userData ? JSON.parse(userData) : null);

    fetchNotification();
  }, []);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isMenuOpen]);

  return (
    <div className="bg-white  flex justify-between py-2 px-2 md:px-4 lg:px-6 fixed top-0 w-[100%] z-1000">
      <div className="flex gap-2 items-center">
        <Link
          to="/"
          className="text-blue-800 flex items-center gap-2 font-bold text-3xl"
        >
          <img className="size-10 shrink-0" src="/bird.svg" alt="Logo" />
          <div className="hidden md:block">
            Career<span className="text-orange-600">Nest</span>
          </div>
        </Link>
        <div className="relative">
          <input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            className="searchInput w-40 max-w-50  md:max-w-120 md:w-70 bg-gray-100 rounded-sm h-10 px-4"
            placeholder="Search...."
          />

          {searchUser.length > 0 && debouncedTerm.length !== 0 && (
            <div className="absolute w-40 md:w-88 left-0 bg-gray-200">
              {searchUser.map((item, index) => {
                return (
                  <Link
                    to={`/profile/${item?._id}`}
                    key={index}
                    onClick={() => searchTerm("")}
                    className="flex gap-2  mb-1 items-center cursor-pointer"
                  >
                    <div>
                      <img
                        className="w-10 h-10 rounded-full"
                        src={item?.profilePic}
                        alt=""
                      />
                    </div>
                    <div>{item?.f_name}</div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="hidden md:gap-4 lg:gap-10 lg:flex">
        <Link
          to={"/feeds"}
          className="flex flex-col items-center cursor-pointer"
        >
          <HomeIcon
            sx={{ color: location.pathname === "/feeds" ? "black" : "gray" }}
          />
          <div
            className={`text-sm text-gray-500 ${
              location.pathname === "/feeds" ? "border-b-3" : ""
            }`}
          >
            Home
          </div>
        </Link>
        <Link
          to={"/myNetwork"}
          className="flex flex-col items-center cursor-pointer"
        >
          <GroupIcon
            sx={{
              color: location.pathname === "/myNetwork" ? "black" : "gray",
            }}
          />
          <div
            className={`text-sm text-gray-500 ${
              location.pathname === "/myNetwork" ? "border-b-3" : ""
            }`}
          >
            My Network
          </div>
        </Link>
        <Link
          to={"/resume"}
          className="flex flex-col items-center cursor-pointer"
        >
          <WorkOutlineIcon
            sx={{ color: location.pathname === "/resume" ? "black" : "gray" }}
          />
          <div
            className={`text-sm text-gray-500 ${
              location.pathname === "/resume" ? "border-b-3" : ""
            }`}
          >
            Resume
          </div>
        </Link>
        <Link
          to={"/messages"}
          className="flex flex-col items-center cursor-pointer"
        >
          <MessageIcon
            sx={{ color: location.pathname === "/messages" ? "black" : "gray" }}
          />
          <div
            className={`text-sm text-gray-500 ${
              location.pathname === "/messages" ? "border-b-3" : ""
            }`}
          >
            Message
          </div>
        </Link>
        <Link
          to={"/notification"}
          className="flex relative flex-col items-center cursor-pointer"
        >
          <div>
            <NotificationsNoneIcon
              sx={{
                color: location.pathname === "/notification" ? "black" : "gray",
              }}
            />
            {notificationCount > 0 && (
              <span className="size-5 top-0 right-3 flex items-center justify-center  absolute rounded-full bg-red-700 text-white">
                {notificationCount}
              </span>
            )}
          </div>
          <div
            className={`text-sm text-gray-500 ${
              location.pathname === "/notification" ? "border-b-3" : ""
            }`}
          >
            Notification
          </div>
        </Link>
        <Link
          to={`/profile/${userData?._id}`}
          className="flex flex-col items-center cursor-pointer"
        >
          <img
            className="w-8 h-8 rounded-full shrink-0"
            src={userData?.profilePic}
            alt={userData?.f_name}
          />
          <div className="text-sm text-gray-500">Me</div>
        </Link>
      </div>

      <div className="flex lg:hidden">
        <button onClick={toggleMenu} className="px-2">
          <MenuIcon />
        </button>
        {isMenuOpen && (
          <div className="absolute flex justify-end inset-0 w-screen h-screen bg-black/10 backdrop-blur-[0.8px]">
            <div className="w-[70%] md:w-[50%] transition-transform ease-in-out relative h-full bg-neutral-200 border-l border-neutral-300 flex flex-col items-center py-12 gap-4">
              <button onClick={toggleMenu} className="absolute right-5 top-4">
                <ClearIcon />
              </button>
              <Link
                to={"/feeds"}
                onClick={toggleMenu}
                className="flex flex-col items-center cursor-pointer"
              >
                <HomeIcon
                  sx={{
                    color: location.pathname === "/feeds" ? "black" : "gray",
                  }}
                />
                <div
                  className={`text-sm text-gray-500 ${
                    location.pathname === "/feeds" ? "border-b-3" : ""
                  }`}
                >
                  Home
                </div>
              </Link>
              <Link
                onClick={toggleMenu}
                to={"/myNetwork"}
                className="flex flex-col items-center cursor-pointer"
              >
                <GroupIcon
                  sx={{
                    color:
                      location.pathname === "/myNetwork" ? "black" : "gray",
                  }}
                />
                <div
                  className={`text-sm text-gray-500 ${
                    location.pathname === "/myNetwork" ? "border-b-3" : ""
                  }`}
                >
                  My Network
                </div>
              </Link>
              <Link
                onClick={toggleMenu}
                to={"/resume"}
                className="flex flex-col items-center cursor-pointer"
              >
                <WorkOutlineIcon
                  sx={{
                    color: location.pathname === "/resume" ? "black" : "gray",
                  }}
                />
                <div
                  className={`text-sm text-gray-500 ${
                    location.pathname === "/resume" ? "border-b-3" : ""
                  }`}
                >
                  Resume
                </div>
              </Link>
              <Link
                onClick={toggleMenu}
                to={"/messages"}
                className="flex flex-col items-center cursor-pointer"
              >
                <MessageIcon
                  sx={{
                    color: location.pathname === "/messages" ? "black" : "gray",
                  }}
                />
                <div
                  className={`text-sm text-gray-500 ${
                    location.pathname === "/messages" ? "border-b-3" : ""
                  }`}
                >
                  Message
                </div>
              </Link>
              <Link
                onClick={toggleMenu}
                to={"/notification"}
                className="flex flex-col items-center cursor-pointer"
              >
                <div className="relative">
                  <NotificationsNoneIcon
                    sx={{
                      color:
                        location.pathname === "/notification"
                          ? "black"
                          : "gray",
                    }}
                  />
                  {notificationCount > 0 && (
                    <span className="size-5 top-0 left-4.5 flex items-center justify-center  absolute rounded-full bg-red-700 text-white">
                      {notificationCount}
                    </span>
                  )}
                </div>
                <div
                  className={`text-sm text-gray-500 ${
                    location.pathname === "/notification" ? "border-b-3" : ""
                  }`}
                >
                  Notification
                </div>
              </Link>
              <Link
                onClick={toggleMenu}
                to={`/profile/${userData?._id}`}
                className="flex flex-col items-center cursor-pointer"
              >
                <img
                  className="w-8 h-8 rounded-full"
                  src={userData?.profilePic}
                  alt=""
                />
                <div className="text-sm text-gray-500">Me</div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar2;
