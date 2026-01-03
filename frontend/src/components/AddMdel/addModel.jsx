import React, { useState } from 'react';
import ImageIcon from '@mui/icons-material/Image';
import { ToastContainer,toast } from 'react-toastify';
import axios from 'axios';
import API from '../../utils/api';

const AddModel = (props) => {

  const [imageUrl,setImageUrl]=useState(null)
  const [desc,setDesc]=useState("");

  //cloudname=dlvaadqgr
  //presetName=careerNest

  const handlePost=async()=>{
      if(desc.trim().length===0 & !imageUrl)
        return toast.error("you must enter atlest one field");
      await API.post('/api/post',{desc:desc,imageLink:imageUrl},{withCredentials:true})
      .then((res=>{
        window.location.reload();

      })).catch(err=>{
        console.log(err)
      })

  }
  const handleUploadImage = async (e) => {
  const files = e.target.files;
  const data = new FormData();
  data.append('file', files[0]); // should be 'file', not 'files'
  data.append('upload_preset', "careerNest"); // make sure this matches your Cloudinary preset

  try {
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dlvaadqgr/image/upload",
      data
    );
    const imageUrl = response.data.secure_url; // more secure and recommended
    setImageUrl(imageUrl);
  } catch (error) {
    console.log(error);
  }
};


  return (
    <div className='h-full flex flex-col relative'>
      {/* Content Area */}
      <div className='flex-1 overflow-auto'>
        {/* User Info */}
        <div className='flex gap-4 items-center mb-4'>
          <img
            className='w-14 h-14 rounded-full object-cover'
            src={props.personalData?.profilePic}
            alt='Profile'
          />
          <div className='text-2xl font-semibold'>{props.personalData?.f_name}</div>
        </div>

        {/* Textarea */}
        <div>
          <textarea value={desc} 
          onChange={(e)=>setDesc(e.target.value)} 
            placeholder='What do you want to talk about?'
            className='w-full resize-none border border-gray-300 rounded-md outline-none text-lg p-3 min-h-[120px]'
          ></textarea>
        </div>

        {/* Preview Image */}
       {
        imageUrl &&  <div className='mt-4'>
          <img
            className='w-24 h-24 object-cover rounded-xl'
            src={imageUrl}
            alt='Preview'
          />
        </div>
       }
      </div>

      {/* Footer Buttons - Fixed at bottom */}
      <div className='flex justify-between items-center mt-4 pt-4 border-t border-gray-300'>
        <label htmlFor='inputFile' className='cursor-pointer'>
          <ImageIcon />
        </label>
        <input onChange={handleUploadImage} type='file' className='hidden' id='inputFile' />

        <button onClick={handlePost}
        className='bg-blue-950 text-white py-2 px-4 rounded-2xl hover:bg-blue-900 transition'>
          Post
        </button>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default AddModel;
