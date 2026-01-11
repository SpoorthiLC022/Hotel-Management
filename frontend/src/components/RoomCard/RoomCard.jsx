import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bed, Users, Wifi, Tv, Coffee, ArrowRight, Star, Mountain, ChevronRight } from 'lucide-react';

const RoomCard = ({ room, onViewDetails }) => {
    const navigate = useNavigate();

    const handleBook = (e) => {
        e.stopPropagation();
        navigate('/payments', { state: { room } });
    };

    return (
        <div
            onClick={() => onViewDetails && onViewDetails(room)}
            className="glass rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100 flex flex-col cursor-pointer"
        >
            <div className="relative h-48 overflow-hidden">
                <img
                    src={room.image || `https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800`}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-primary-600 shadow-sm">
                    ₹{room.price.toLocaleString('en-IN')}/night
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-slate-900">{room.name}</h3>
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${room.status === 'Available' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                        {room.status}
                    </span>
                </div>

                <p className="text-slate-500 text-sm mb-4 line-clamp-2">{room.description}</p>

                <div className="flex items-center gap-4 mb-6 text-slate-400">
                    <div className="flex items-center gap-1.5 border-r border-slate-100 pr-4">
                        <Users className="w-4 h-4" />
                        <span className="text-xs">{room.capacity} Guests</span>
                    </div>
                    <div className="flex items-center gap-1.5 border-r border-slate-100 pr-4">
                        <Bed className="w-4 h-4" />
                        <span className="text-xs">{room.type}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Wifi className="w-4 h-4" />
                        <Tv className="w-4 h-4" />
                        <Coffee className="w-4 h-4" />
                    </div>
                </div>

                <button
                    onClick={handleBook}
                    className="mt-auto w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 group"
                    disabled={room.status !== 'Available'}
                >
                    <span>Book Now</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default RoomCard;
