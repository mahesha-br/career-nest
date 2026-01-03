import axios from 'axios';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../utils/api';

const MessageModal = ( selfData, userData ) =>
{
  const [ message, setMassage ] = useState( '' );

  const { id } = useParams();

  
  const handleSendMessage = async () =>
  {

    await API.post( '/api/conversation/add-conversation', { receiverId: id, message }, { withCredentials: true } )
      .then( res =>
      {

        window.location.reload();

      } ).catch( err =>
      {
        console.log( err );
        alert( err?.response?.data?.error );
      } );
  };

  return (
    <div className='my-5'>
      <div className='w-full mb-4'>
        <textarea value={ message } onChange={ ( e ) => setMassage( e.target.value ) }
          className='p-2 mt-1 w-full border-1 rounded-md ' placeholder='Enter a Message' cols={ 10 } rows={ 10 } ></textarea>
      </div>
      <div onClick={ handleSendMessage }
        className='bg-blue-950 text-white w-fit py-1 px-3 cursor-pointer rounded-2xl'>Send</div>
    </div>
  );
};

export default MessageModal;