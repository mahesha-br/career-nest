import React, { useEffect, useState } from 'react';
import Advertisement from '../../components/Advertisement/advertisement';
import ProfileCard from '../../components/ProfileCard/profileCard';
import Card from '../../components/Card/card';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';

const Notification = () =>
{
    const navigate = useNavigate();

    const [ ownData, setOwnData ] = useState( null );
    const [ notifications, setNotifications ] = useState( [] );

    const fetchNotificationData = async () => {
        await API.get( '/api/notification', { withCredentials: true } )
            .then( res =>
            {
                console.log( res.data.notifications );
                setNotifications( res.data.notifications );
            } ).catch( err =>
            {
                console.log( err );
                alert( "Something Went Wrong" );
            } )
        };

        const handleOnClickNotification = async(item)=>{
            await API.put('/api/notification/isRead',{notificationId:item._id},{withCredentials:true})
            .then(res=>{
                 if(item.type==="comment"){
                    navigate(`/profile/${ownData?._id}/activities/${item.postId}`)
                 }else{
                    navigate('/myNetwork')
                 }
            }).catch( err =>
            {
                console.log( err );
                alert( "Something Went Wrong" );
            } )
        }

    useEffect( () =>
    {
        const userData = localStorage.getItem( 'userInfo' );
        setOwnData( userData ? JSON.parse( userData ) : null );

        fetchNotificationData();
    }, [] );



    return (
        <div className='px-5 xl:px-10 py-8 flex gap-5 w-full mt-5 bg-gray-100'>

            <div className='w-[21%] mt-5 sm:block sm:w-[23%] hidden py-5'>
                <div className='h-fit'>
                    <ProfileCard data={ ownData } />
                </div>

            </div>

            <div className='w-[80%] mt-5 py-5 sm:-[50%] '>
                <div>
                    <Card padding={ 0 }>
                        <div className='w-full'>

                            {
                                notifications.map( ( item, index ) =>
                                {
                                    return (
                                        <div key={index} onClick={()=>{handleOnClickNotification(item)}}
                                        className={ `border-b-1 cursor-pointer flex gap-4 items-center border-gray-300 p-3 
                                        ${item?.isRead?'bg-gray-200':'bg-blue-100'}` }>
                                            <img className='rounded-full cursor-pointer w-15 h-15'
                                                src={item?.sender?.profilePic}
                                                alt="" />
                                            <div>{item?.content}</div>

                                        </div>
                                    );
                                } )
                            }



                        </div>

                    </Card>
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

export default Notification;