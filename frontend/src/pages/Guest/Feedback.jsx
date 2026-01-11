import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookings } from '../../redux/slices/bookingSlice';
import api from '../../services/api';
import { Star, MessageSquare, Send, CheckCircle2, Image as ImageIcon, Building, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Feedback = () => {
    const dispatch = useDispatch();
    const { bookings, loading } = useSelector((state) => state.bookings);

    const [selectedRoom, setSelectedRoom] = useState('');
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        dispatch(fetchBookings());
    }, [dispatch]);

    // Handle initial room selection if bookings exist
    useEffect(() => {
        if (!selectedRoom && bookings.length > 0) {
            // Prefer completed bookings, fallback to any
            const completed = bookings.find(b => b.status === 'Completed');
            if (completed) setSelectedRoom(completed.room._id);
            else if (bookings[0]?.room) setSelectedRoom(bookings[0].room._id);
        }
    }, [bookings, selectedRoom]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedRoom) return toast.error('Please select a room to review');
        if (rating === 0) return toast.error('Please select a rating');
        if (!comment.trim()) return toast.error('Please write a comment');

        setIsSubmitting(true);
        try {
            await api.post('/reviews', {
                room: selectedRoom,
                rating,
                comment
            });
            setSubmitted(true);
            toast.success('Thank you for your feedback!');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || 'Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading your stays...</div>;
    }

    if (bookings.length === 0) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4 max-w-sm glass p-8 rounded-2xl border border-slate-100">
                    <Building className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-900">No Stays Found</h2>
                    <p className="text-slate-500">You need to book and stay with us before you can leave a review!</p>
                    <Link to="/rooms" className="inline-block bg-primary-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-primary-700 transition-colors mt-4">
                        Book a Room
                    </Link>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4 max-w-sm">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 rounded-full mb-4">
                        <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Feedback Submitted</h2>
                    <p className="text-slate-500">Your review helps us improve our service. We hope to see you again soon!</p>
                    <button
                        onClick={() => {
                            setSubmitted(false);
                            setRating(0);
                            setComment('');
                        }}
                        className="text-primary-600 font-bold hover:underline pt-4"
                    >
                        Submit another review
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Guest Feedback</h1>
                <p className="text-slate-500">How was your stay? We'd love to hear from you.</p>
            </div>

            <form onSubmit={handleSubmit} className="glass p-8 rounded-2xl shadow-sm border border-slate-100 space-y-8">

                {/* Room Selection */}
                <div className="space-y-2">
                    <label className="text-slate-700 font-semibold block">Select Stay</label>
                    <div className="relative">
                        <select
                            value={selectedRoom}
                            onChange={(e) => setSelectedRoom(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer"
                        >
                            <option value="" disabled>Select a room...</option>
                            {bookings.map((booking) => (
                                <option key={booking._id} value={booking.room?._id}>
                                    {booking.room?.name || 'By Room ID'} ({new Date(booking.checkIn).toLocaleDateString()}) - {booking.status}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                <div className="text-center space-y-4 pt-4 border-t border-slate-50">
                    <p className="text-slate-700 font-semibold">Rate your experience</p>
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className={`transition-all duration-200 ${(hover || rating) >= star ? 'text-amber-400 scale-110' : 'text-slate-200'
                                    }`}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                                onClick={() => setRating(star)}
                            >
                                <Star className={`w-10 h-10 ${(hover || rating) >= star ? 'fill-amber-400' : 'fill-transparent'}`} />
                            </button>
                        ))}
                    </div>
                    <p className="text-sm text-slate-400">
                        {rating === 5 ? 'Excellent!' : rating === 4 ? 'Very Good' : rating === 3 ? 'Average' : rating === 2 ? 'Poor' : rating === 1 ? 'Terrible' : 'Select a rating'}
                    </p>
                </div>

                <div className="space-y-2">
                    <label className="text-slate-700 font-semibold flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Your Comments
                    </label>
                    <textarea
                        rows="4"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 resize-none transition-all"
                        placeholder="Tell us about your stay, the staff, the food..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                </div>

                <div className="flex items-center gap-4">
                    <button type="button" className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-all text-sm font-medium">
                        <ImageIcon className="w-4 h-4" />
                        Add Photos
                    </button>
                    <p className="text-xs text-slate-400">Add up to 5 photos of your stay.</p>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {isSubmitting ? 'Submitting...' : (
                        <>
                            <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            Submit Feedback
                        </>
                    )}
                </button>
            </form>

            <div className="pt-8">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Reviews</h3>
                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="glass p-4 rounded-xl border border-slate-100 text-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-slate-900">Guest User {i}</span>
                                <div className="flex gap-1 text-amber-400">
                                    <Star className="w-3 h-3 fill-amber-400" />
                                    <Star className="w-3 h-3 fill-amber-400" />
                                    <Star className="w-3 h-3 fill-amber-400" />
                                    <Star className="w-3 h-3 fill-amber-400" />
                                    <Star className="w-3 h-3 fill-transparent" />
                                </div>
                            </div>
                            <p className="text-slate-500 italic">"The ocean view was absolutely stunning. Highly recommend the deluxe suite!"</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Feedback;
