import BG from '../assets/QueueBG.jpg';
import WhiteLogo from '../assets/WhiteLogo.png';
import QueuLogo from '../assets/Logo.svg';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className='w-full h-screen bg-cover bg-center '
      style={{
        backgroundImage: `url(${BG})`,
      }}
    >
      <div className="relative w-full h-full bg-[#000000b0]  flex flex-col items-center justify-center p-2">
        <div className='absolute top-0 flex justify-between items-center sm:hidden w-full h-auto bg-white py-2.5 px-2'>
            <a href="">
                <img src={QueuLogo} className='w-30' alt="" />
            </a>
            <div>
                <Link to='/signup'
                className='text-white border border-[#069094] hover:border-[#069094] hover:text-[#069094] text-sm bg-[#069094] hover:bg-white px-3 py-1.5 rounded-md'>
                Signup
                </Link>

                <Link to='/login'
                className='text-[#069094] hover:text-white text-sm border border-[#069094] hover:bg-[#069094] duration-300 px-4 py-1.5 ml-2 rounded-md'>
                Login
                </Link>
            </div>
        </div>
        <h1 className='text-3xl sm:text-[50px] text-white font-bold'>
            Book Smarter.
        </h1>

        <h1 className='text-[50px] text-white font-light'>
           Wait Less. 
        </h1>

        <h1 className='text-3xl sm:text-[50px] text-white font-bold'>
            Feel Better.
        </h1>

        <div className='flex justify-center items-center w-full sm:w-1/2 h-auto mb-4 p-2'>
            <p className='text-center text-white text-sm'>
                <span className='font-bold'>QueueCare</span> is an intelligent appointment booking system built to eliminate the pain of long clinic queues. Whether you're visiting for a check-up or need a specialist, we make it fast and simple to book your spot—so you can get care without the chaos. 
            </p>
        </div>
       
       <Link to='/signup'
       className='bg-white hover:bg-[#e9e9e9] px-5 py-2.5 rounded-lg text-[#069094] hover:text-black duration-300 hover:animate-pulse font-bold'>
       START NOW
       </Link>
       <div className='absolute hidden sm:block bottom-5 flex-col justify-center items-center  '>
        <img src={WhiteLogo} className='w-50' alt="" />
       </div>
      </div>
    </div>
  );
}
