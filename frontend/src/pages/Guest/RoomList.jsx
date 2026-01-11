import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchRooms } from '../../redux/slices/roomSlice';
import RoomCard from '../../components/RoomCard/RoomCard';
import { Search, Filter, SlidersHorizontal, Calendar, X, Check, Bed, Users as UsersIcon, Wifi, Tv, Coffee, Sparkles, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RoomList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { rooms, loading } = useSelector((state) => state.rooms);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [selectedRoom, setSelectedRoom] = useState(null);

    useEffect(() => {
        dispatch(fetchRooms());
    }, [dispatch]);

    const filteredRooms = rooms.filter(room =>
        (typeFilter === 'All' || room.type === typeFilter) &&
        room.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Explore Rooms</h1>
                    <p className="text-slate-500">Find the perfect stay for your next adventure.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search rooms..."
                            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none w-full md:w-64"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors">
                        <SlidersHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {['All', 'Suite', 'Double', 'Villa', 'Single'].map((type) => (
                    <button
                        key={type}
                        onClick={() => setTypeFilter(type)}
                        className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap ${typeFilter === type
                            ? 'bg-primary-600 text-white shadow-md'
                            : 'bg-white text-slate-600 border border-slate-200 hover:border-primary-300'
                            }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredRooms.length > 0 ? (
                    filteredRooms.map((room) => (
                        <RoomCard
                            key={room._id}
                            room={room}
                            onViewDetails={(r) => setSelectedRoom(r)}
                        />
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                            <Search className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No rooms found</h3>
                        <p className="text-slate-500">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>

            {/* Room Detail Modal */}
            <AnimatePresence>
                {selectedRoom && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedRoom(null)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
                        >
                            <button
                                onClick={() => setSelectedRoom(null)}
                                className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-500 hover:text-slate-900 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="md:w-1/2 h-64 md:h-auto overflow-hidden">
                                <img src={selectedRoom.image} alt={selectedRoom.name} className="w-full h-full object-cover" />
                            </div>

                            <div className="md:w-1/2 p-8 overflow-y-auto">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2.5 py-1 bg-primary-50 text-primary-600 text-xs font-bold rounded-lg uppercase tracking-wider">
                                                {selectedRoom.type}
                                            </span>
                                            <div className="flex items-center gap-1 text-amber-500">
                                                <Star className="w-4 h-4 fill-amber-500" />
                                                <span className="text-sm font-bold text-slate-700">4.9 (42 reviews)</span>
                                            </div>
                                        </div>
                                        <h2 className="text-3xl font-bold text-slate-900 leading-tight">{selectedRoom.name}</h2>
                                    </div>

                                    <p className="text-slate-500 leading-relaxed">{selectedRoom.description}</p>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-3">
                                            <UsersIcon className="w-5 h-5 text-primary-600" />
                                            <div>
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Guests</p>
                                                <p className="text-sm font-bold text-slate-900">Up to {selectedRoom.capacity}</p>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-3">
                                            <Bed className="w-5 h-5 text-primary-600" />
                                            <div>
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Bed Type</p>
                                                <p className="text-sm font-bold text-slate-900">{selectedRoom.type}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-primary-500" />
                                            Premium Amenities
                                        </h4>
                                        <div className="grid grid-cols-2 gap-y-2">
                                            {(selectedRoom.amenities || ['Free WiFi', 'Mini Bar', 'Smart TV', 'Room Service']).map((item) => (
                                                <div key={item} className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Check className="w-4 h-4 text-emerald-500" />
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                                        <div>
                                            <p className="text-2xl font-bold text-slate-900">₹{selectedRoom.price.toLocaleString('en-IN')}</p>
                                            <p className="text-xs text-slate-400 font-medium">per night • inclusive of taxes</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setSelectedRoom(null);
                                                navigate('/payments', { state: { room: selectedRoom } });
                                            }}
                                            className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-xl transition-all active:scale-95"
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RoomList;
