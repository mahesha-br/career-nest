import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = (props) =>
{
    return (
        <div className='my-4 min-h-[78.2vh] py-[50px] md:pl-[120px] px-5 md:flex justify-between'>
            <div className='md:w-[40%]'>
                <div className='text-4xl mx-auto text-gray-800 font-medium text-center'>Welcome To Your Professional Community</div>
                
                <Link to="/login" className='flex mx-auto mt-[40px] py-3 px-2 bg-blue-800 hover:bg-blue-900 text-white font-medium rounded-3xl items-center w-[70%] 
                justify-center cursor-pointer text-xl shadow-md'>
                    Sign In
                </Link>
                <Link to="/signup" className='flex mx-auto mt-[20px] py-3 px-2 bg-white text-black border border-neutral-300 font-medium rounded-3xl items-center w-[70%] 
                justify-center hover:bg-gray-100 cursor-pointer text-xl shadow-sm'>
                    Join Now / Sign Up
                </Link>

                <div className='mx-auto mb-4 text-sm w-[70%] text-center text-balance mt-6'>By clicking Continue to join or sign in,you agree to
                    <span className='text-blue-800 cursor-pointer hover:underline'> CareerNest's User Agrement</span>,
                    <span className='text-blue-800 cursor-pointer hover:underline'>Privacy Policy</span>,and
                    <span className='text-blue-800 cursor-pointer hover:underline'> Cookie Policy</span>.
                </div>
                <Link to={'/signup'} className='hover:text-blue-800 hover:underline my-3 text-shadow ml-8'>
                    New to CareerNest? <span className='text-blue-800 cursor-pointer hover:underline'>Join now</span>
                </Link>
                
            </div>
            <div className='md:w-[60%] shadow-md shadow-neutral-400 rounded-md overflow-hidden'>
                    <img src={ "/community.png" } alt="image" className='w-full h-full' />
                </div>
        </div>
    );
};

export default LandingPage;