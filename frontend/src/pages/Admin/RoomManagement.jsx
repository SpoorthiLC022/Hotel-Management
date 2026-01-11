import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRooms, addRoom, updateRoom, deleteRoom } from '../../redux/slices/roomSlice';
import { Plus, Edit2, Trash2, X, Check, Search, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const RoomManagement = () => {
    const dispatch = useDispatch();
    const { rooms } = useSelector((state) => state.rooms);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        dispatch(fetchRooms());
    }, [dispatch]);

    const [formData, setFormData] = useState({
        name: '',
        type: 'Single',
        price: '',
        capacity: '',
        status: 'Available',
        description: '',
        image: ''
    });

    const resetForm = () => {
        setFormData({ name: '', type: 'Single', price: '', capacity: '', status: 'Available', description: '', image: '' });
        setEditingRoom(null);
    };

    const handleOpenModal = (room = null) => {
        if (room) {
            setEditingRoom(room);
            setFormData(room);
        } else {
            resetForm();
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const roomData = { ...formData, price: Number(formData.price), capacity: Number(formData.capacity) };

        if (editingRoom) {
            dispatch(updateRoom(roomData));
            toast.success('Room updated successfully');
        } else {
            dispatch(addRoom(roomData));
            toast.success('Room added successfully');
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this room?')) {
            dispatch(deleteRoom(id));
            toast.success('Room deleted');
        }
    };

    const filteredRooms = rooms.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Room Management</h1>
                    <p className="text-slate-500">Add, edit, or remove rooms from the hotel inventory.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-primary-500/20 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add New Room
                </button>
            </div>

            <div className="glass p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search rooms..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRooms.map((room) => (
                    <div key={room._id} className="glass p-4 rounded-2xl border border-slate-100 flex gap-4 items-center group">
                        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                            <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-900 truncate">{room.name}</h3>
                            <p className="text-sm text-slate-500">₹{room.price.toLocaleString('en-IN')}</p>
                            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md ${room.status === 'Available' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                {room.status}
                            </span>
                        </div>
                        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleOpenModal(room)} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg">
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(room._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">{editingRoom ? 'Edit Room' : 'Add New Room'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Room Name</label>
                                    <input required type="text" className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Room Type</label>
                                    <select className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                                        <option value="Single">Single</option>
                                        <option value="Double">Double</option>
                                        <option value="Suite">Suite</option>
                                        <option value="Villa">Villa</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Price (INR)</label>
                                    <input required type="number" className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Capacity</label>
                                    <input required type="number" className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Image URL</label>
                                    <div className="flex gap-2">
                                        <input required type="url" className="flex-1 px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
                                        <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center overflow-hidden">
                                            {formData.image ? <img src={formData.image} className="w-full h-full object-cover" /> : <ImageIcon className="w-5 h-5 text-slate-300" />}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Description</label>
                                    <textarea rows="3" className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                                </div>
                            </div>
                            <button type="submit" className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl hover:bg-slate-800 transition-all">
                                {editingRoom ? 'Update Room' : 'Create Room'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomManagement;
