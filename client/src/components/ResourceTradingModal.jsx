import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { XMarkIcon } from '@heroicons/react/24/solid';
import axios from 'axios';

const ResourceTradingModal = ({ resource, user, closeModal }) => {
    const ref = useRef();
    const [isAddressPopupOpen, setIsAddressPopupOpen] = useState(false);
    const [address, setAddress] = useState('');

    useEffect(() => {
        if (!resource) return;

        // Handle click outside to close the modal
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                closeModal();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [resource, closeModal]);

    if (!resource) return null;

    const handleProceedClick = () => {
        setIsAddressPopupOpen(true);
    };

    const handleAddressSubmit = async () => {
        if (!address) {
            alert('Please enter an address.');
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/email/send-order-email`, {
                ownerEmail: resource.ownerEmail,
                userEmail: user.email,
                address: address,
                orderDetails: {
                    title: resource.title,
                    price: resource.price,
                    quantity: resource.quantity,
                },
            });

            if (response.status === 200) {
                alert('Order email sent successfully!');
                closeModal();
            }
        } catch (error) {
            console.error('Failed to send email:', error);
            alert('Failed to send email.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-85 flex items-center justify-center z-50 transition ease-in-out duration-200">
            <div ref={ref} className="relative bg-black text-white border-2 border-mlsa-sky-blue shadow-md rounded-lg w-[50%] h-[30rem] p-5">
                <div className='h-[90%] flex items-center justify-around'>
                    <XMarkIcon
                        className="absolute top-4 right-4 w-8 h-8 cursor-pointer text-mlsa-sky-blue transition hover:scale-110"
                        onClick={closeModal}
                    />
                    <div className="flex h-[80%] w-[45%] gap-4">
                        <img
                            src={resource.img || '/Demo_Image.png'}
                            alt={resource.title}
                            className="w-full h-full rounded-md border-2 border-mlsa-sky-blue"
                        />
                    </div>
                    <div className='flex flex-col items-start justify-start h-[80%] gap-4 w-[45%]'>
                        <h2 className="text-xl font-bold mb-2">{resource.title}</h2>
                        <p className="text-sm italic text-gray-400">In return: {resource.inReturn}</p>
                        <p>Price: <span className="font-bold">${resource.price}</span></p>
                        <p>Quantity: <span className="font-bold">{resource.quantity}</span></p>
                    </div>
                </div>
                <button onClick={handleProceedClick} className="bg-mlsa-sky-blue px-4 py-2 rounded-md font-bold text-black w-full">
                    Proceed
                </button>

                {isAddressPopupOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-85 flex items-center justify-center z-50">
                        <div className="bg-white text-black p-6 rounded-lg w-96">
                            <h3 className="text-xl font-bold mb-4">Enter Your Address</h3>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Enter your address"
                                className="w-full p-2 border border-gray-400 rounded-md"
                            />
                            <div className="flex justify-between mt-4">
                                <button onClick={() => setIsAddressPopupOpen(false)} className="bg-red-500 px-4 py-2 text-white rounded-md">Cancel</button>
                                <button onClick={handleAddressSubmit} className="bg-green-500 px-4 py-2 text-white rounded-md">Submit</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

ResourceTradingModal.propTypes = {
    resource: PropTypes.shape({
        ownerEmail: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        quantity: PropTypes.number.isRequired,
        img: PropTypes.string,
        inReturn: PropTypes.string.isRequired,
    }).isRequired,
    user: PropTypes.shape({
        email: PropTypes.string.isRequired,
    }).isRequired,
    closeModal: PropTypes.func.isRequired,
};

export default ResourceTradingModal;