import { UserCircleIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const Navbar = ({ activeView, setActiveView }) => {
    const navigate = useNavigate();
    const year = new Date().getFullYear();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/auth');
    };

    return (
        <div className="left-0 h-[80%] w-[26%] border-2 border-mlsa-sky-blue rounded-md text-white px-4 flex items-center flex-col justify-between">
            <div className='w-full'>
                <div className="text-center text-xl font-bold py-4">
                    Hackocalypse
                </div>
                <hr className="h-1 border-none bg-mlsa-sky-blue mb-4" />
                <div className="gap-2 flex items-center flex-col justify-center">
                    <div className="w-full bg-mlsa-sky-blue flex items-center justify-center font-bold text-black rounded-md py-[2px]">
                        <UserCircleIcon className="h-6 w-6 mr-1" />
                        User
                    </div>
                    <div
                        className="w-full border-2 border-mlsa-sky-blue flex items-center justify-center font-bold text-white rounded-md py-[3px] transition duration-100 ease-in-out hover:bg-red-700 cursor-pointer"
                        onClick={handleLogout}
                    >
                        Logout
                    </div>
                </div>
            </div>
            <div className='w-full flex flex-col items-center justify-center gap-3'>
                <div
                    className={`w-full flex items-center justify-center font-bold rounded-md py-[3px] transition duration-100 ease-in-out cursor-pointer ${activeView === 'real-time-comm' ? 'bg-mlsa-sky-blue text-black' : 'hover:bg-mlsa-sky-blue hover:text-black'}`}
                    onClick={() => setActiveView('real-time-comm')}
                >
                    Real-time Communication
                </div>
                <div
                    className={`w-full flex items-center justify-center font-bold rounded-md py-[3px] transition duration-100 ease-in-out cursor-pointer ${activeView === 'resourceTrading' ? 'bg-mlsa-sky-blue text-black' : 'hover:bg-mlsa-sky-blue hover:text-black'}`}
                    onClick={() => setActiveView('resourceTrading')}
                >
                    Resource Trading
                </div>
            </div>
            <div className='w-full text-[0.7rem] text-center pb-2'>
                Copyright &copy;{year} | Hackocalypse
            </div>
        </div>
    );
};

Navbar.propTypes = {
    activeView: PropTypes.string.isRequired,
    setActiveView: PropTypes.func.isRequired,
};

export default Navbar;