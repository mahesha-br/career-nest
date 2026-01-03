import React, { useEffect, useState } from 'react';
import ProfileCard from '../../components/ProfileCard/profileCard';
import axios from 'axios';
import API from '../../utils/api';

const MyNetwork = () =>
{
    const [ text, setText ] = useState( "Catch up with friends" );
    const [ data, setData ] = useState( [] );



    const handleFriends = async () =>
    {
        setText( "Catch up with friends" );
    };
    const handlePending = async () =>
    {
        setText( "Pending Request" );
    };

    const fetchFriendList = async () =>
    {
        await API.get( 'API/api/auth/friendsList', { withCredentials: true } )
            .then( ( res ) =>
            {
                console.log( res );
                setData( res.data.friends );
            } ).catch( err =>
            {
                console.log( err );
                alert( "Something Went Wrong" );
            } );
    };

    const fetchPendingRequest = async () =>
    {
        await API.get( '/api/auth/pendingFriendsList', { withCredentials: true } )
            .then( ( res ) =>
            {
                console.log( res );
                setData( res.data.pending_friends );
            } ).catch( err =>
            {
                console.log( err );
                alert( "Something Went Wrong" );
            } );
    };

    useEffect( () =>
    {
        if ( text === "Catch up with friends" )
        {
            fetchFriendList();
        } else
        {
            fetchPendingRequest();
        }

    }, [ text ] );

    return (
        <div className='px-5 xl:px-10 py-8 flex flex-col gap-5 w-full mt-5 bg-gray-100'>
            <div className='py-4 px-10 border-gray-400 w-full justify-between my-5 text-xl bg-white rounded-xl flex items-center'>
                <div>{ text }</div>
                <div className='flex gap-3'>
                    <button onClick={ handleFriends } className={ `p-1 cursor-pointer border-1 rounded-lg border-gray-300
                     ${ text === "Catch up with friends" ? 'bg-blue-800 text-white' : '' }` }>Friends</button>
                    <button onClick={ handlePending } className={ `p-1 cursor-pointer border-1 rounded-lg border-gray-300
                       ${ text === "Pending Request" ? 'bg-blue-800 text-white' : '' } ` }>Pending Request</button>
                </div>
            </div>
            <div className='flex h-[80vh] w-full gap-7 flex-wrap items-start justify-center'>
                {
                    data.map( ( item, index ) =>
                    {
                        return (
                            <div className='md:w-[23%] h-[270px] sm:w-full'>
                                <ProfileCard data={item}/>
                            </div>
                        );
                    } )
                }

                {
                    data.length===0 ? text ==="Catch up with friends"? <div>No any Friends Yet</div>:
                    <div>No any Pending Friends</div>:null
                }




            </div>
        </div>
    );
};

export default MyNetwork;
