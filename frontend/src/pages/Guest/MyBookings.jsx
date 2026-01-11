import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBookings, updateBookingStatus } from '../../redux/slices/bookingSlice';
import { Calendar, MapPin, CreditCard, ChevronRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const MyBookings = () => {
    const dispatch = useDispatch();
    const { bookings, loading } = useSelector((state) => state.bookings);

    useEffect(() => {
        dispatch(fetchBookings());
    }, [dispatch]);

    const handleCancel = (id) => {
        if (window.confirm('Are you sure you want to cancel this booking? A 100% refund will be processed.')) {
            dispatch(updateBookingStatus({ id, status: 'Cancelled' }));
            toast.success('Stay cancelled. Refund initiated.');
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
                    <p className="text-slate-500">Manage and view your stay history at StaySync.</p>
                </div>
                <Link
                    to="/rooms"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors flex items-center gap-2"
                >
                    Book New Room
                </Link>
            </div>

            <div className="grid gap-6">
                {bookings.length > 0 ? (
                    bookings.map((booking) => (
                        <div key={booking._id} className={`glass p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center gap-6 ${booking.status === 'Cancelled' ? 'opacity-60 saturate-50' : ''}`}>
                            <div className="w-full md:w-48 h-32 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                                <img
                                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400"
                                    alt="Room"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex-1 space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-slate-900">{booking.room?.name || 'Room'}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${booking.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600' :
                                        booking.status === 'Completed' ? 'bg-blue-50 text-blue-600' :
                                            booking.status === 'Cancelled' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <Calendar className="w-4 h-4 text-primary-500" />
                                        <span>Check-in: {new Date(booking.checkIn).toLocaleDateString('en-IN')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <Clock className="w-4 h-4 text-primary-500" />
                                        <span>1 Night</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <CreditCard className="w-4 h-4 text-primary-500" />
                                        <span>{booking.status === 'Cancelled' ? 'Refunded: ' : 'Paid: '}₹{(booking.totalPrice || 0).toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-00 font-bold">
                                        ID: {booking._id?.slice(-6) || 'N/A'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                {booking.status === 'Confirmed' ? (
                                    <button
                                        onClick={() => handleCancel(booking._id)}
                                        className="flex-1 md:flex-none px-4 py-2 bg-rose-50 text-rose-600 rounded-lg text-sm font-bold hover:bg-rose-100 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <AlertCircle className="w-4 h-4" />
                                        Cancel Stay
                                    </button>
                                ) : (
                                    <button className="flex-1 md:flex-none px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                                        Receipt
                                    </button>
                                )}
                                <button className="flex-1 md:flex-none px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                                    Details
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-20 text-center glass rounded-2xl border-2 border-dashed border-slate-200">
                        <Calendar className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 mb-1">No bookings found</h3>
                        <p className="text-slate-500 mb-6">You haven't made any reservations yet.</p>
                        <Link to="/rooms" className="text-primary-600 font-bold hover:underline">Start browsing rooms</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
