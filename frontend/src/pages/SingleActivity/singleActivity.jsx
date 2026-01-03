import React, { useEffect, useState } from 'react';
import ProfileCard from '../../components/ProfileCard/profileCard';
import Card from '@mui/material/Card';
import Post from '../../components/Post/post';
import Advertisement from '../../components/Advertisement/advertisement';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import API from '../../utils/api';

const SingleActivity = () =>
{
    const { id, postId } = useParams();
    
    const [post,setPost]=useState(null)

    const [ ownData, setOwnData ] = useState( null );
    const fetchDataOnLoad = async () =>
    {
        await API.get( `/api/post/getPostById/${ postId }` ).then( res =>
        {
            console.log( res );
            setPost(res.data.post)

        } ).catch( err =>
        {
            console.log( err );
            alert( err?.response?.data?.error );
        } );
    };

    useEffect( () =>
    {
        fetchDataOnLoad();
        const userData = localStorage.getItem( 'userInfo' );
        setOwnData( userData ? JSON.parse( userData ) : null );
    }, [] );
    return (
        <div className='px-5 xl:px-10 py-8 flex gap-5 w-full mt-5 bg-gray-100'>
            {/*left side */ }
            <div className='w-[21%] sm:block sm:w-[23%] hidden py-5'>
                <div className='h-fit'>
                    <ProfileCard data={post?.user}/>
                </div>


            </div>

            {/* middle side */ }
            <div className='w-[80%] py-5 sm:-[50%]'>
                <div>
                    <Post item={post} personalData={ ownData } />
                </div>
            </div>

            {/*right side */ }
            <div className='w-[26%] py-5 hidden md:block'>
                <div className='my-5 sticky top-19'>
                    <Advertisement />

                </div>
            </div>
        </div>
    );
};
export default SingleActivity;