import { useEffect, useState } from 'react';
import ProfileCard from '../../components/ProfileCard/profileCard';
import API from '../../utils/api';

const MyNetwork = () => {
  const [text, setText] = useState("Catch up with friends");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFriends = () => setText("Catch up with friends");
  const handlePending = () => setText("Pending Request");

  const fetchFriendList = async () => {
    setIsLoading(true);
    try {
      const res = await API.get('/api/auth/friendsList', { withCredentials: true });
      setData(res.data.friends);
    } catch (err) {
      console.error("Error fetching friends", err);
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPendingRequest = async () => {
    setIsLoading(true);
    try {
      const res = await API.get('/api/auth/pendingFriendsList', { withCredentials: true });
      setData(res.data.pending_friends);
    } catch (err) {
      console.error("Error fetching pending requests", err);
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (text === "Catch up with friends") {
      fetchFriendList();
    } else {
      fetchPendingRequest();
    }
  }, [text]);

  const renderSkeleton = () => {
    return [...Array(4)].map((_, i) => (
      <div key={i} className="md:w-[23%] sm:w-full h-[270px] bg-gray-300 rounded-xl animate-pulse" />
    ));
  };

  return (
    <div className='px-5 xl:px-10 py-8 flex flex-col gap-5 w-full mt-5 bg-gray-100'>
      
      <div className='py-4 px-2 md:px-10 border-gray-400 w-full justify-between my-5 text-lg md:text-xl bg-white rounded-xl flex flex-col gap-4 md:flex-row md:gap-0 items-center'>
        <div className='font-semibold'>{text}</div>
        <div className='flex-col md:flex-row flex items-center gap-3'>
          <button 
            onClick={handleFriends} 
            className={`p-1 px-2 w-full md:w-fit cursor-pointer border-1 rounded-lg border-gray-300 ${text === "Catch up with friends" ? 'bg-blue-800 text-white' : ''}`}>
            Friends
          </button>
          <button 
            onClick={handlePending} 
            className={`p-1 px-2 w-full md:w-fit cursor-pointer border-1 rounded-lg border-gray-300 ${text === "Pending Request" ? 'bg-blue-800 text-white' : ''}`}>
            Pending Request
          </button>
        </div>
      </div>


      <div className='flex h-[70vh] md:h-[80vh] w-full gap-7 flex-wrap items-start justify-center'>
        {isLoading ? (
          renderSkeleton()
        ) : data.length === 0 ? (
          <div className="text-gray-500 text-lg mt-5">
            {text === "Catch up with friends" ? "No friends yet." : "No pending requests."}
          </div>
        ) : (
          data.map((item, index) => (
            <div key={index} className='md:w-[23%] h-[270px] sm:w-full'>
              <ProfileCard data={item} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyNetwork;
