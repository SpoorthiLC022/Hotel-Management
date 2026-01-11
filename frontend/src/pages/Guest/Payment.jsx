import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { CreditCard, ShieldCheck, CheckCircle2, Download, Hotel, Calendar, Clock } from 'lucide-react';
import { createBooking } from '../../redux/slices/bookingSlice';
import toast from 'react-hot-toast';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const room = location.state?.room;

    if (!room) {
        navigate('/guest/rooms');
        return null;
    }

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const [checkInDate, setCheckInDate] = useState(today);
    const [checkOutDate, setCheckOutDate] = useState(tomorrow);
    const [checkInTime, setCheckInTime] = useState('14:00');
    const [checkOutTime, setCheckOutTime] = useState('11:00');

    const days = useMemo(() => {
        const start = new Date(checkInDate);
        const end = new Date(checkOutDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 1;
    }, [checkInDate, checkOutDate]);

    const totalPrice = room.price * days;
    const basePrice = Math.round(totalPrice * 0.85);
    const serviceFee = Math.round(totalPrice * 0.08);
    const taxes = totalPrice - basePrice - serviceFee;

    const handlePayment = async () => {
        const bookingData = {
            room: room._id, // Use _id from backend
            checkIn: checkInDate,
            checkOut: checkOutDate,
            totalPrice
        };

        toast.promise(
            dispatch(createBooking(bookingData)).unwrap(),
            {
                loading: 'Processing payment...',
                success: () => {
                    setTimeout(() => navigate('/guest/dashboard'), 1500);
                    return 'Booking confirmed! Redirecting to dashboard...';
                },
                error: (err) => err || 'Payment failed. Please try again.',
            }
        );
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Secure Payment</h1>
                <p className="text-slate-500">Complete your booking securely for {room.name}.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Stay Selection & Payment Form */}
                <div className="space-y-8">
                    {/* Stay Details */}
                    <div className="glass p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                        <div className="flex items-center gap-3 text-primary-600 font-bold mb-4">
                            <Calendar className="w-6 h-6" />
                            <span>Stay Duration</span>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700">Check-in Date</label>
                                <input
                                    type="date"
                                    min={today}
                                    value={checkInDate}
                                    onChange={(e) => setCheckInDate(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700">Check-out Date</label>
                                <input
                                    type="date"
                                    min={checkInDate}
                                    value={checkOutDate}
                                    onChange={(e) => setCheckOutDate(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700">Check-in Time</label>
                                <input
                                    type="time"
                                    value={checkInTime}
                                    onChange={(e) => setCheckInTime(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700">Check-out Time</label>
                                <input
                                    type="time"
                                    value={checkOutTime}
                                    onChange={(e) => setCheckOutTime(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div className="glass p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                        <div className="flex items-center gap-3 text-primary-600 font-bold mb-4">
                            <CreditCard className="w-6 h-6" />
                            <span>Card Details</span>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Cardholder Name</label>
                                <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Card Number</label>
                                <div className="relative">
                                    <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500" placeholder="0000 0000 0000 0000" />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                                    <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500" placeholder="MM/YY" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">CVV</label>
                                    <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500" placeholder="•••" />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handlePayment}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            <ShieldCheck className="w-5 h-5" />
                            Pay ₹{totalPrice.toLocaleString('en-IN')}.00
                        </button>

                        <p className="text-center text-xs text-slate-400 mt-4">
                            Your payment is processed securely via industry-standard encryption.
                        </p>
                    </div>
                </div>

                {/* Summary */}
                <div className="space-y-6 lg:sticky lg:top-24">
                    <div className="glass p-8 rounded-2xl shadow-sm border border-slate-100 bg-slate-50/50">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 font-primary">Reservation Summary</h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 bg-white rounded-xl border border-slate-100 overflow-hidden shrink-0">
                                    <img src={room.image} alt="Room" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">{room.name}</h4>
                                    <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1 font-medium">
                                        <Clock className="w-4 h-4" />
                                        {days} Day{days > 1 ? 's' : ''} Stay
                                    </div>
                                    <p className="text-xs text-slate-400 mt-0.5">{room.capacity || 2} Guests • Non-refundable</p>
                                </div>
                            </div>

                            <div className="h-px bg-slate-200 my-4"></div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 font-medium">₹{(room.price).toLocaleString('en-IN')} x {days} Days</span>
                                    <span className="font-bold text-slate-700">₹{totalPrice.toLocaleString('en-IN')}.00</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Service Fee (8%)</span>
                                    <span className="font-medium">₹{serviceFee.toLocaleString('en-IN')}.00</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Tax (approx.)</span>
                                    <span className="font-medium">₹{taxes.toLocaleString('en-IN')}.00</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold pt-4 border-t border-slate-200">
                                    <span className="text-slate-900">Total Price</span>
                                    <span className="text-primary-600">₹{totalPrice.toLocaleString('en-IN')}.00</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
                        <Download className="w-4 h-4" />
                        Download Quote (PDF)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Payment;
