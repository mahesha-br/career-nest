import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GoogleLoginComponent from '../../components/GoogleLogin/googleLoginComponent';
import { ToastContainer, toast } from 'react-toastify';
import API from '../../utils/api';

const Signup = (props) => {
  const navigate = useNavigate();

  const [registerField, setRegidterField] = useState({
    email: "",
    password: "",
    f_name: ""
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputFiled = (event, key) => {
    setRegidterField({ ...registerField, [key]: event.target.value });
  };

  const handleRegister = async () => {
    if (
      registerField.email.trim().length === 0 ||
      registerField.password.trim().length === 0 ||
      registerField.f_name.trim().length === 0
    ) {
      return toast.error("Please Fill All Details.");
    }

    setIsLoading(true);

    await API.post('/api/auth/register', registerField)
      .then(res => {
        toast.success("You have registered successfully");
        setRegidterField({ email: "", password: "", f_name: "" });
        navigate('/login');
      })
      .catch(err => {
        console.log(err);
        toast.error(err?.response?.data?.error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className='w-full min-h-[82vh] flex flex-col items-center justify-center'>
      <div className='text-4xl text-center font-bold mt-2 mb-5'>
        <h1 className='text-shadow-2xs text-shadow-neutral-500'>
          Make the most of your professional life
        </h1>
      </div>

      <div className='w-[85%] md:w-[28%] border border-neutral-200 shadow-xl rounded-sm box p-10'>
        <div className='flex flex-col gap-4'>
          <div>
            <label>Email</label>
            <input
              value={registerField.email}
              onChange={(e) => handleInputFiled(e, 'email')}
              type="text"
              className='w-full text-xl border-2 rounded-lg px-5 py-1'
              placeholder='Email'
              disabled={isLoading}
            />
          </div>

          <div>
            <label>Password</label>
            <input
              value={registerField.password}
              onChange={(e) => handleInputFiled(e, 'password')}
              type="password"
              className='w-full text-xl border-2 rounded-lg px-5 py-1'
              placeholder='Password'
              disabled={isLoading}
            />
          </div>

          <div>
            <label>Full name</label>
            <input
              value={registerField.f_name}
              onChange={(e) => handleInputFiled(e, 'f_name')}
              type="text"
              className='w-full text-xl border-2 rounded-lg px-5 py-1'
              placeholder='Full Name'
              disabled={isLoading}
            />
          </div>

          {/* Register Button */}
          <div
            onClick={!isLoading ? handleRegister : undefined}
            className={`w-full flex items-center justify-center gap-3 
              ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-800 hover:bg-blue-900 cursor-pointer'}
              text-white px-3 py-4 rounded-xl text-xl my-2`}
          >
            {isLoading && (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {isLoading ? 'Registering...' : 'Register'}
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <div className='border-b-1 border-gray-400 w-[45%]' />
          <div>or</div>
          <div className='border-b-1 border-gray-400 w-[45%] my-6' />
        </div>

        <GoogleLoginComponent changeLoginValue={props.changeLoginValue} />
      </div>

      <div className='mt-4 mb-10'>
        Already on CareerNest?
        <Link to='/login' className='text-blue-800 cursor-pointer ml-1'>
          Sign in
        </Link>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Signup;
