import React from "react";
import { Link } from "react-router-dom";

const Navbar1 = () => {
  return (
    <nav className="w-[100%] bg-gray-100 md:px[100px] px-2 flex justify-between py-3 md:py-4 box-border">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 md:gap-2 text-blue-800 font-bold text-lg md:text-3xl items-center cursor-pointer">
          <img className=" size-6 md:size-10" src="/bird.svg" alt="Logo" />
          <div>Career<span className="text-orange-600">Nest</span></div>
          {/* <h3 className='text-blue-800 font-bold text-xl md:text-3xl'>CareerNest</h3> */}
        </div>
      </div>
      <div className="flex box-border md:gap-4 gap-2 justify-center items-center">
        <Link
          to={"/signup"}
          className="md:px-4 md:py-2 box-border text-black rounded-3xl hover:bg-gray-300 transition-colors ease-in-out font-bold cursor-pointer"
        >
          Join now
        </Link>
        <Link
          to="/login"
          className="px-4 py-2 box-border border-1 text-blue-800 rounded-3xl hover:bg-blue-100 transition-colors ease-in-out cursor-pointer"
        >
          Sign in
        </Link>
      </div>
    </nav>
  );
};

export default Navbar1;
