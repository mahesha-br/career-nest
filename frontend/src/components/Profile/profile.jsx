import React, { useEffect, useState } from 'react';
import Advertisement from '../Advertisement/advertisement';
import Card from '../../components/Card/card';
import EditIcon from '@mui/icons-material/Edit';
import Post from '../Post/post';
import AddIcon from '@mui/icons-material/Add';
import Model from '../Model/model';
import ImageModal from '../ImageModal/imageModal';
import EditInfoModal from '../EditiInfoModal/editInfoModal';
import AboutModal from '../AboutModal/aboutModal';
import ExpModal from '../ExpModal/expModal';
import MessageModal from '../MessageModal/messageModal';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';

const Profile = () =>
{
    const { id } = useParams();
    const navigate = useNavigate();

    const [ imageSetModal, setImageModal ] = useState( false );
    const [ circularImage, setCircularImage ] = useState( true );
    const [ infoModal, setInfoModal ] = useState( false );
    const [ aboutModal, setAboutModal ] = useState( false );
    const [ expModal, setExpModal ] = useState( false );
    const [ messageModal, setMessageModal ] = useState( false );

    const [ userData, setUserData ] = useState( null );
    const [ postData, setPostData ] = useState( [] );
    const [ ownData, setOwnData ] = useState( null );

    const [ updateExp, setUpdateExp ] = useState( { clicked: "", id: "", datas: {} } );

    const updateExpEdit = ( id, data ) =>
    {
        setUpdateExp( {
            ...updateExp,
            clicked: true, id: id, data: data
        } );
        setExpModal( prev => !prev );
    };


    useEffect( () =>
    {
        fetchDataOnLoad();

    }, [ id ] );


    const fetchDataOnLoad = async () =>
    {
        try
        {
            const [ userDatas, postDatas, ownDatas ] = await Promise.all( [
                API.get( `/api/auth/user/${ id }` ),
                API.get( `/api/post/getTop5Post/${ id }` ),
                API.get( '/api/auth/self', { withCredentials: true } ),
            ] );

            setUserData(userDatas.data.user );
            setPostData( postDatas.data.posts );
            setOwnData( ownDatas.data.user );


            localStorage.setItem( 'userInfo', JSON.stringify( ownDatas.data.user ) );




        } catch ( error )
        {
            console.log( error );
            alert( "something went Wrong" );
            //toast.error( err?.response?.data?.error );
        }
    };

    const handleMessageModal = () =>
    {
        setMessageModal( prev => !prev );
    };

    const handleExpModal = () =>
    {
        if ( expModal )
        {
            setUpdateExp( { clicked: "", id: "", datas: {} } );
        }
        setExpModal( prev => !prev );
    };

    const handleAboutModal = () =>
    {
        setAboutModal( prev => !prev );
    };

    const handelInfoModal = () =>
    {
        setInfoModal( prev => !prev ); // ✅ fixed: using functional form
    };


    const handleImageModalOPenClose = () =>
    {
        setImageModal( prev => !prev );
    };
    const handleOnEditCover = () =>
    {
        setImageModal( true );
        setCircularImage( false );

    };
    const handleCircularImageOpen = () =>
    {
        setImageModal( true );
        setCircularImage( true );
    };

    const handleEditFunc = async ( data ) =>
    {
        await API.put( `/api/auth/update`, { user: data }, { withCredentials: true } )
            .then( res =>
            {
                window.location.reload();

            } ).catch( err =>
            {
                console.log( err );
                alert( "Something Went Wrong" );
            } );

    };

    const amIfriend = () =>
    {
        let arr = userData?.friends?.filter( ( item ) => { return item === ownData?._id; } );
        return arr?.length;
    };

    const isInPendingList = () =>
    {
        let arr = userData?.pending_friends?.filter( ( item ) => { return item === ownData?._id; } );
        return arr?.length;
    };

    const isInSelfPendingList = () =>
    {
        let arr = ownData?.pending_friends?.filter( ( item ) => { return item === userData?._id; } );
        return arr?.length;
    };
    const checkFriendStatus = () =>
    {
        if ( amIfriend() )
        {
            return "Disconnect";
        } else if ( isInSelfPendingList() )
        {
            return "Approve Request";
        } else if ( isInPendingList() )
        {
            return "Request Sent";
        }
        else
        {
            return "Connect";
        }
    };

    const handleSendFriendRequest = async () =>
    {
        if ( checkFriendStatus() === "Request Sent" ) return;
        if ( checkFriendStatus() === "Connect" )
        {
            await API.post( '/api/auth/sendFriendReq', { reciever: userData?._id }, { withCredentials: true } )
                .then( res =>
                {
                    toast.success( res.data.message );
                    setTimeout( () =>
                    {
                        window.location.reload();
                    }, 2000 );

                } ).catch( err =>
                {
                    console.log( err );
                    toast.error( err?.response?.data?.error );
                } );
        }
        else if ( checkFriendStatus() === "Approve Request" )
        {
            await API.post( '/api/auth/acceptFriendRequest', { friendId: userData?._id }, { withCredentials: true } )
                .then( res =>
                {
                    toast.success( res.data.message );
                    setTimeout( () =>
                    {
                        window.location.reload();
                    }, 2000 );

                } ).catch( err =>
                {
                    console.log( err );
                    toast.error( err?.response?.data?.error );
                } );
        } else
        {
            await API.delete( `/api/auth/removeFromFriendList/${ userData?._id }`, { withCredentials: true } )
                .then( res =>
                {
                    toast.success( res.data.message );
                    setTimeout( () =>
                    {
                        window.location.reload();
                    }, 2000 );

                } ).catch( err =>
                {
                    console.log( err );
                    toast.error( err?.response?.data?.error );
                } );
        }
    };

    const handleLogout = async () =>
    {
        await API.post( '/api/auth/logout', {}, { withCredentials: true } )
            .then( res =>
            {
                localStorage.clear();
                window.location.reload();

            } ).catch( err =>
            {
                console.log( err );
                toast.error( err?.response?.data?.error );
            } );
    };

    const copyToClipboard = async () =>
    {
        try
        {
            let string = `/profile/${id}`;
            await navigator.clipboard.writeText( string );
            toast.success( 'copied to clipboard' );

        } catch ( error )
        {
            console.log( "Failed to copy", error );

        }
    };

    return (
        <div className='px-5 xl:px-50 py-5 mt-5 flex flex-col gap-5 w-full pt-12 bg-gray-100'>
            <div className='flex justify-between'>
                {/* left side main section */ }
                <div className='w-full md:w-[70%]'>
                    <div>
                        <Card padding={ 0 } >
                            <div className='w-full h-fit'>
                                <div className='relative w-full h-[200px]'>
                                    {
                                        userData?._id?.toString() === ownData?._id?.toString() &&
                                        <div className='absolute cursor-pointer top-3 right-3 z-20 w-[30px] flex justify-center 
                                                       items-center h-[15%] rounded-full p-3 bg-white'
                                            onClick={ handleOnEditCover }>
                                            <EditIcon />
                                        </div>
                                    }

                                    <img className='w-full h-[200px] rounded-tr-lg rounded-tl-lg'
                                        src={ userData?.cover_pic }
                                        alt="logo" />
                                    <div onClick={ handleCircularImageOpen } className='absolute object-cover top-24 left-6 z-10'>
                                        <img className='rounded-full border-2 border-white cursor-pointer w-35 h-35'
                                            src={ userData?.profilePic }
                                            alt="" />
                                    </div>
                                </div>

                                <div className='mt-10 relative px-8 py-2'>

                                    {
                                        userData?._id?.toString() === ownData?._id?.toString() &&
                                        <div className='absolute cursor-pointer top-3 right-3 z-20 w-[30px] flex justify-center 
                                    items-center h-[15%] rounded-full p-3 bg-white' onClick={ handelInfoModal }><EditIcon /></div>
                                    }

                                    <div className='w-full'>
                                        <div className='text-2xl'>{ userData?.f_name }</div>
                                        <div className='text-gray-700'>{ userData?.headlines }</div>
                                        <div className='text-sm text-gray-500'>{ userData?.curr_location }</div>
                                        <div className='text-md text-blue-800 w-fit cursor-pointer hover:underline'>{ userData?.friends?.length } Connection</div>

                                        <div className='md:flex w-full justify-between'>
                                            <div className='my-5 flex gap-2'>
                                                <div className='cursor-pointer p-2 rounded-lg border-1 bg-blue-800 text-white font-semibold'>Open to</div>
                                                <div className='cursor-pointer p-2 rounded-lg border-1 bg-blue-800 text-white font-semibold' onClick={copyToClipboard}>Share</div>
                                                {
                                                    userData?._id?.toString() === ownData?._id?.toString() &&
                                                    <div onClick={ handleLogout }
                                                        className='cursor-pointer p-2 rounded-lg border-1 bg-blue-800 text-white font-semibold'>Logout</div>
                                                }

                                            </div>
                                            <div className='my-5 flex gap-2'>
                                                {
                                                    amIfriend() ?
                                                        <div className='cursor-pointer p-2 rounded-lg border-1 bg-blue-800 text-white font-semibold' onClick={ handleMessageModal }>Message</div> : null
                                                }
                                                { userData?._id?.toString() === ownData?._id?.toString() ? null :
                                                    <div onClick={ handleSendFriendRequest }
                                                        className='cursor-pointer p-2 rounded-lg border-1 bg-blue-800 text-white font-semibold'>{ checkFriendStatus() }</div>
                                                }


                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className='mt-5'>
                        <Card padding={ 1 }>
                            <div className='flex justify-between items-center'>
                                <div className='text-xl' >About</div>
                                {
                                    userData?._id?.toString() === ownData?._id?.toString() &&
                                    <div className='cursor-pointer' onClick={ handleAboutModal }><EditIcon /></div>
                                }

                            </div>
                            <div className='text-gray-700 text-md w-[80%]'>
                                { userData?.about }</div>
                        </Card>
                    </div>

                    <div className='mt-5'>
                        <Card padding={ 1 }>
                            <div className='flex justify-between items-center'>
                                <div className='text-xl'>Skills</div>
                            </div>

                            {/* Skill tags container */ }
                            <div className='text-gray-700 text-md my-2 gap-4 flex flex-wrap'>
                                {
                                    userData?.skills?.map( ( item, index ) =>
                                    {
                                        return (
                                            <div key={ index } className='py-2 px-3 cursor-pointer bg-blue-800 text-white rounded-lg'>{ item }</div>
                                        );
                                    } )
                                }

                            </div>
                        </Card>
                    </div>

                    <div className='mt-5'>
                        <Card padding={ 1 }>
                            <div className='flex justify-between items-center'>
                                <div className='text-xl'>Activities</div>
                            </div>
                            <div className='cursor-pointer px-3 py-1 w-fit rounded-4xl bg-green-800
                            text-white font-semibold'>Post</div>
                            {/* parent div for scrollebal activities*/ }
                            <div className='overflow-x-auto my-2 flex gap-2 overflow-y-hidden w-full'>
                                {
                                    postData.map( ( item, ind ) =>
                                    {
                                        return (
                                            <div className="cursor-pointer shrink-0 w-[350px] h-[560px]" onClick={ () => navigate( `/profile/${ id }/activities/${ item?._id }` ) }>
                                                <Post profile={ 1 } item={ item } personalData={ ownData } />
                                            </div>


                                        );
                                    } )
                                }
                            </div>

                            <Link to={ `/profile/${ id }/activities` } className='w-full flex justify-center items-center'>
                                <div className='p-2 rounded-xl cursor-pointer hover:bg-gray-300'>Show All
                                    <ArrowRightAltIcon />
                                </div>

                            </Link>
                        </Card>
                    </div>


                    <div className='mt-5'>
                        <Card padding={ 1 }>
                            <div className='flex justify-between items-center'>
                                <div className='text-xl'>Experience</div>
                                {
                                    userData?._id?.toString() === ownData?._id?.toString() &&
                                    <div className='cursor-pointer' onClick={ handleExpModal }><AddIcon /></div>
                                }

                            </div>

                            <div className='mt-5'>
                                {
                                    userData?.experience.map( ( item, index ) =>
                                    {
                                        return (
                                            <div className='p-2 border-t-1 border-gray-300 flex justify-between'>
                                                <div>
                                                    <div className='text-lg'>{ item.designation }</div>
                                                    <div className='text-sm'>{ item.company_name }</div>
                                                    <div className='text-sm text-gray-500'>{ item.duration }</div>
                                                    <div className='text-sm text-gray-500'>{ item.location }</div>
                                                </div>
                                                {
                                                    userData?._id?.toString() === ownData?._id?.toString() &&
                                                    <div className='cursor-pointer'><EditIcon onClick={ () => { updateExpEdit( item._id, item ); } } /></div>
                                                }


                                            </div>
                                        );
                                    } )
                                }

                            </div>
                        </Card>

                    </div>

                </div>
                <div className='hidden md:flex md:w-[28%]'>
                    <div className='sticky top-19'>
                        <Advertisement />
                    </div>
                </div>
            </div>
            {
                imageSetModal && <Model title="Upload Image" closeModel={ handleImageModalOPenClose } >
                    <ImageModal handleEditFunc={ handleEditFunc } selfData={ ownData } isCircular={ circularImage } />
                </Model>
            }
            {
                infoModal && <Model title="Edit Info" closeModel={ handelInfoModal }>
                    <EditInfoModal handleEditFunc={ handleEditFunc } selfData={ ownData } />
                </Model>
            }

            {
                aboutModal && <Model title=' Edit About' closeModel={ handleAboutModal }>
                    <AboutModal handleEditFunc={ handleEditFunc } selfData={ ownData } />

                </Model>
            }

            {
                expModal && <Model title="Experience" closeModel={ handleExpModal }>
                    <ExpModal handleEditFunc={ handleEditFunc } selfData={ ownData }
                        updateExp={ updateExp } setUpdateExp={ updateExpEdit } />
                </Model>
            }

            {
               ( messageModal && userData )&& <Model title='Send Message' closeModel={ handleMessageModal }>
                    <MessageModal selfData={ownData} userData={id}/>

                </Model>
            }
            <ToastContainer />
        </div>
    );
};

export default Profile;