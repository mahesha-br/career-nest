import React, { useEffect, useState } from 'react';
import Card from '../Card/card';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Conversation from '../Conversation/conversation';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ImageIcon from '@mui/icons-material/Image';
import Advertisement from '../Advertisement/advertisement';
import axios from 'axios';
import API from '../../utils/api';

const Messages = () =>
{
    const [ conversations, setConversations ] = useState( [] );
    const [ ownData, setOwnData ] = useState( null );
    const [ selectedConversation, setSelectedConversation ] = useState( null );
    const [ newMessage, setNewMessage ] = useState( "" );

    const [ activeConvId, setActiveConvId ] = useState( null );
    const [ selectedConvDetail, setSelectedConvDetails ] = useState( null );

    const [ messages, setMessages ] = useState( [] );

    const [ loading, setLoading ] = useState( false );
    const [ imageLink, setImageLink ] = useState( null );
    const [ messageText, setMessageText ] = useState( "" );

    const handleSelectedConv = ( id, userData ) =>
    {
        setActiveConvId( id );
        setSelectedConvDetails( userData );
    };

    useEffect( () =>
    {
        const userData = localStorage.getItem( 'userInfo' );
        setOwnData( userData ? JSON.parse( userData ) : null );
        fetchConversationLoad();
    }, [] );



    useEffect( () =>
    {
        if ( activeConvId )
        {
            fetchMessages();
        }


    }, [ activeConvId ] );

    const fetchMessages = async () =>
    {
        await API.get( `/api/message/${ activeConvId }`, { withCredentials: true } )
            .then( res =>
            {
                console.log( res );
                setMessages( res.data.message );
            } ).catch( err =>
            {
                console.log( err );
                alert( "Something Went Wrong" );
            } );
    };

    const fetchConversationLoad = async () =>
    {
        try
        {
            const res = await API.get( '/api/conversation/get-conversation', {
                withCredentials: true
            } );
            setConversations( res.data.conversations );
            setActiveConvId( res.data?.conversations[ 0 ]?._id );
            let ownId = ownData?._id;
            let arr = res.data?.conversations[ 0 ]?.members.filter( ( it ) => it._id !== ownId );
            setSelectedConvDetails( arr[ 0 ] );
        } catch ( err )
        {
            console.error( err );
            alert( "Something went wrong while fetching conversations." );
        }
    };

    const getReceiverId = () =>
    {
        if ( !selectedConversation || !ownData ) return null;
        return selectedConversation.members.find(
            member => String( member._id ) !== String( ownData._id )
        );
    };

    const handleSendMessage = async () =>
    {
        await API.post(`/api/message`,{conversation:activeConvId,message:messageText,picture:imageLink},{withCredentials:true})
        .then(res=>{
            setMessageText("")
            console.log(res)
        }).catch(error=>{
            console.log(error)
            alert("Something Went Wrong")
        })
        // const receiver = getReceiverId();
        // if ( !receiver || !newMessage.trim() )
        // {
        //     console.log( "receiver:", receiver, "mess:", newMessage );
        //     alert( "Receiver ID and message are required." );
        //     return;
        // }

        // try
        // {
        //     await API.post( "/api/conversation/add-conversation", {
        //         receiverId: receiver._id, // ✅ fixed key
        //         message: newMessage
        //     }, {
        //         withCredentials: true
        //     } );

        //     setNewMessage( "" );
        //     fetchConversationLoad(); // Optional: refresh conversation list
        // } catch ( error )
        // {
        //     console.error( error );
        //     alert( "Failed to send message." );
        // }
    };


    const handleInputImage = async ( e ) =>
    {
        const files = e.target.files;
        const data = new FormData();
        data.append( 'file', files[ 0 ] ); // should be 'file', not 'files'
        data.append( 'upload_preset', "careerNest" ); // make sure this matches your Cloudinary preset
        setLoading( true );

        try
        {
            const response = await axios.post(
                "https://api.cloudinary.com/v1_1/dlvaadqgr/image/upload",
                data
            );
            const imageUrl = response.data.secure_url; // more secure and recommended
            setImageLink( imageUrl );
        } catch ( error )
        {
            console.log( error );
        } finally
        {
            setLoading( false );
        }
    };

    return (
        <div className='px-5 xl:px-10 py-8 flex gap-5 w-full mt-5 bg-gray-100'>
            <div className='w-full justify-between flex pt-5'>
                {/* LEFT SIDE */ }
                <div className='w-full md:w-[70%]'>
                    <Card padding={ 0 }>
                        <div className='border-b-1 border-gray-300 px-5 py-2 font-semibold text-lg'>Messaging</div>
                        <div className='border-b-1 border-gray-300 px-5 py-2'>
                            <div className='py-1 px-3 cursor-pointer bg-green-800 hover:bg-green-900 font-semibold flex gap-2 w-fit rounded-2xl text-white'>
                                Focused <ArrowDropDownIcon />
                            </div>
                        </div>

                        <div className='w-full md:flex'>
                            {/* Conversation List */ }
                            <div className='h-[590px] overflow-auto w-full md:w-[40%] border-r-1 border-gray-400'>
                                { conversations.map( item => (
                                    <Conversation
                                        activeConvId={ activeConvId }
                                        handleSelectedConv={ handleSelectedConv }
                                        key={ item._id }
                                        item={ item }
                                        ownData={ ownData }
                                    //onClick={() => setSelectedConversation(item)}
                                    />
                                ) ) }
                            </div>

                            {/* Chat Area */ }
                            <div className='w-full md:w-[60%] border-gray-400'>
                                <div className='border-gray-300 py-2 px-4 border-b-2 flex justify-between items-center'>
                                    <div>
                                        <p className='text-sm font-semibold'>
                                            { selectedConvDetail?.f_name }
                                        </p>
                                        <p className='text-sm text-gray-400'>{ selectedConvDetail?.headlines }</p>
                                    </div>
                                    <div><MoreHorizIcon /></div>
                                </div>

                                <div className='h-[360px] w-full overflow-auto  border-gray-300 '>
                                    <div className='w-full border-gray-300 gap-3 p-4 border-b-2'>
                                        <img className='rounded-[100%] cursor-pointer w-16 h-15'
                                            src={ selectedConvDetail?.profilePic } alt="" />

                                        <div className='my-2'>
                                            <div className='text-md'>{ selectedConvDetail?.f_name }</div>
                                            <div className='text-sm text-gray-500'>{ selectedConvDetail?.headlines }</div>
                                        </div>
                                    </div>
                                    {/* Example message */ }
                                    {
                                        messages.map( ( item, index ) =>
                                        {
                                            return (
                                                <div key={ index } className='flex w-full cursor-pointer border-gray-400   gap-3 p-4'>
                                                    <div className='shrink-0'>
                                                        <img
                                                            className='w-8 h-8 rounded-[100%] cursor-pointer'
                                                            src={ item?.sender?.profilePic }
                                                            alt=""
                                                        />
                                                    </div>
                                                    <div className='mb-2 w-full'>
                                                        <div className='text-md'>{ item?.sender?.f_name }</div>
                                                        <div className='text-sm mt-6 hover:bg-gray-200'>{ item?.message }</div>
                                                        {
                                                            item?.picture &&
                                                            <div className='my-2'>
                                                                <img
                                                                    className='w-[240px] h-[180px] rounded-md'
                                                                    src={ item?.picture }
                                                                    alt=""
                                                                />
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            );
                                        } )
                                    }
                                </div>

                                {/* Message Input */ }
                                <div className='p-2 w-full border-b-1 border-gray-200'>
                                    <textarea
                                        value={ messageText }
                                        onChange={ ( e ) => setMessageText( e.target.value ) }
                                        rows={ 4 }
                                        className='bg-gray-200 outline-0 rounded-xl text-sm w-full p-3'
                                        placeholder='Write a message'
                                    />

                                </div>

                                <div className='p-3 flex justify-between'>
                                    <div>
                                        <label htmlFor="messageImage" className='cursor-pointer'><ImageIcon /></label>
                                        <input type="file" id='messageImage' onChange={ handleInputImage } className='hidden' />
                                    </div>
                                    {
                                        !loading && <div 
                                            className='px-3 py-1 cursor-pointer rounded-2xl border-1 bg-blue-950 text-white'
                                            onClick={ handleSendMessage }>
                                            Send
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* RIGHT SIDE */ }
                <div className='hidden md:flex md:w-[25%]'>
                    <div className='sticky top-19'>
                        <Advertisement />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;
