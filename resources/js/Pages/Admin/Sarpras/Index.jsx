import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Box } from 'lucide-react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const CONDITION_COLORS = {
    'Baik': '#4ade80',         // green-400
    'Rusak Ringan': '#facc15', // yellow-400
    'Rusak Berat': '#f87171'   // red-400
};

const CATEGORY_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#14b8a6', '#f43f5e', '#6366f1'];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    return percent > 0 ? (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    ) : null;
};

export default function InventoryIndex({ auth, inventoryItems, filters, statistics }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        item_code: '',
        name: '',
        category: '',
        condition: 'baik',
        location: '',
        quantity: 1,
        notes: '',
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        router.get(route('admin.sarpras.inventories.index'), {
            ...filters,
            [name]: value
        }, { preserveState: true });
    };

    const openCreateModal = () => {
        setEditingItem(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setData({
            item_code: item.item_code,
            name: item.name,
            category: item.category,
            condition: item.condition,
            location: item.location || '',
            quantity: item.quantity,
            notes: item.notes || '',
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        
        if (editingItem) {
            put(route('admin.sarpras.inventories.update', editingItem.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('admin.sarpras.inventories.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
            destroy(route('admin.sarpras.inventories.destroy', id));
        }
    };

    const renderConditionBadge = (condition) => {
        const badges = {
            baik: 'bg-green-100 text-green-800',
            rusak_ringan: 'bg-yellow-100 text-yellow-800',
            rusak_berat: 'bg-orange-100 text-orange-800',
            hilang: 'bg-red-100 text-red-800',
        };
        const labels = {
            baik: 'Baik',
            rusak_ringan: 'Rusak Ringan',
            rusak_berat: 'Rusak Berat',
            hilang: 'Hilang',
        };
        return (
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badges[condition]}`}>
                {labels[condition]}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-brand-500 to-indigo-600 rounded-2xl shadow-neon-violet">
                            <Box className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="font-black text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-brand-600 tracking-tight">
                            Manajemen Sarpras
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Manajemen Sarpras" />

            <div className="py-6 md:py-12 relative z-10">
                {/* Ambient Background Blobs */}
                <div className="absolute top-0 -left-40 w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob pointer-events-none"></div>
                <div className="absolute top-0 -right-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000 pointer-events-none"></div>
                <div className="absolute -bottom-40 left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-0 sm:px-4 md:px-6 lg:px-8 relative z-10 space-y-6">

                    {/* Statistik Inventaris Card */}
                    {statistics && (
                        <div className="bg-white/80 backdrop-blur-xl p-4 sm:p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-6">Statistik Inventaris Barang</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-500 mb-4 text-center">Kondisi Barang</h4>
                                    <div className="h-[300px] w-full flex justify-center">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={statistics.condition_distribution}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={renderCustomizedLabel}
                                                    outerRadius="75%"
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {statistics.condition_distribution.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={CONDITION_COLORS[entry.name]} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip formatter={(value) => [`${value} Barang`, 'Jumlah']} />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-500 mb-4 text-center">Kategori Barang</h4>
                                    <div className="h-[300px] w-full flex justify-center">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={statistics.category_distribution}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={renderCustomizedLabel}
                                                    outerRadius="75%"
                                                    fill="#8b5cf6"
                                                    dataKey="value"
                                                >
                                                    {statistics.category_distribution.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip formatter={(value) => [`${value} Barang`, 'Jumlah']} />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                        <div className="mb-6 md:mb-8">
                            
                            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4 w-full">
                                <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full xl:w-auto">
                                    <input 
                                        type="text" 
                                        name="search"
                                        placeholder="Cari Kode / Nama"
                                        className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-sm w-full sm:w-auto"
                                        defaultValue={filters.search}
                                        onBlur={handleFilterChange}
                                        onKeyDown={e => e.key === 'Enter' && handleFilterChange(e)}
                                    />
                                    <input 
                                        type="text" 
                                        name="category"
                                        placeholder="Kategori"
                                        className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-sm w-full sm:w-auto"
                                        defaultValue={filters.category}
                                        onBlur={handleFilterChange}
                                        onKeyDown={e => e.key === 'Enter' && handleFilterChange(e)}
                                    />
                                    <select 
                                        name="condition"
                                        className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-sm w-full sm:w-auto"
                                        defaultValue={filters.condition}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">Semua Kondisi</option>
                                        <option value="baik">Baik</option>
                                        <option value="rusak_ringan">Rusak Ringan</option>
                                        <option value="rusak_berat">Rusak Berat</option>
                                        <option value="hilang">Hilang</option>
                                    </select>
                                </div>

                                <PrimaryButton onClick={openCreateModal} className="w-full sm:w-auto justify-center">
                                    + Tambah Barang
                                </PrimaryButton>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="hidden md:table min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Barang</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Kondisi</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {inventoryItems.data.map(item => (
                                            <tr key={item.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {item.item_code}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {item.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item.category}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item.location || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                                                    {item.quantity}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                    {renderConditionBadge(item.condition)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button onClick={() => openEditModal(item)} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                                                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">Hapus</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile View */}
                            <div className="md:hidden space-y-4 mt-4">
                                {inventoryItems.data.map(item => (
                                    <div key={item.id} className="bg-white p-4 rounded-[1.5rem] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] border border-slate-50 flex flex-col">
                                        <div className="flex items-center gap-3.5 ml-1">
                                            <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 shrink-0 border-2 border-white shadow-sm">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-slate-800 text-base leading-tight truncate">{item.name}</h3>
                                                <p className="text-xs font-medium text-slate-500 mt-0.5">{item.item_code}</p>
                                            </div>
                                            <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${
                                                (item.condition || 'baik') === 'baik' ? 'bg-green-100 text-green-800' : 
                                                (item.condition || 'baik') === 'rusak_ringan' ? 'bg-yellow-100 text-yellow-800' : 
                                                (item.condition || 'baik') === 'rusak_berat' ? 'bg-orange-100 text-orange-800' : 
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {(item.condition || 'baik').replace('_', ' ')}
                                            </span>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-2 mt-4 ml-1 mb-3">
                                            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Kategori</p>
                                                <p className="text-xs font-bold text-slate-700 mt-0.5 truncate">{item.category}</p>
                                            </div>
                                            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Lokasi</p>
                                                <p className="text-xs font-bold text-slate-700 mt-0.5 truncate">{item.location || '-'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-50 ml-1">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs font-medium text-slate-500">Jumlah:</span>
                                                <span className="px-2.5 py-1 text-xs font-bold bg-brand-50 text-brand-600 rounded-lg">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            
                                            <div className="flex gap-2">
                                                <button onClick={() => openEditModal(item)} className="p-2 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            

                            {inventoryItems.data.length === 0 && (
                                    <div className="text-center py-6 text-gray-500">
                                        Tidak ada data barang ditemukan.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        {editingItem ? 'Edit Barang Inventaris' : 'Tambah Barang Baru'}
                    </h2>
                    
                    <form onSubmit={submit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="item_code" value="Kode Barang" />
                                <TextInput
                                    id="item_code"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.item_code}
                                    onChange={e => setData('item_code', e.target.value)}
                                    required
                                />
                                <InputError message={errors.item_code} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="name" value="Nama Barang" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="category" value="Kategori" />
                                <TextInput
                                    id="category"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.category}
                                    onChange={e => setData('category', e.target.value)}
                                    required
                                />
                                <InputError message={errors.category} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="location" value="Lokasi Penempatan" />
                                <TextInput
                                    id="location"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.location}
                                    onChange={e => setData('location', e.target.value)}
                                />
                                <InputError message={errors.location} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="quantity" value="Jumlah Barang (Kuantitas)" />
                                <TextInput
                                    id="quantity"
                                    type="number"
                                    min="1"
                                    className="mt-1 block w-full"
                                    value={data.quantity}
                                    onChange={e => setData('quantity', e.target.value)}
                                    required
                                />
                                <InputError message={errors.quantity} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="condition" value="Kondisi" />
                                <select
                                    id="condition"
                                    className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full"
                                    value={data.condition}
                                    onChange={e => setData('condition', e.target.value)}
                                    required
                                >
                                    <option value="baik">Baik</option>
                                    <option value="rusak_ringan">Rusak Ringan</option>
                                    <option value="rusak_berat">Rusak Berat</option>
                                    <option value="hilang">Hilang</option>
                                </select>
                                <InputError message={errors.condition} className="mt-2" />
                            </div>
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="notes" value="Catatan Tambahan" />
                            <textarea
                                id="notes"
                                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full"
                                rows="3"
                                value={data.notes}
                                onChange={e => setData('notes', e.target.value)}
                            />
                            <InputError message={errors.notes} className="mt-2" />
                        </div>

                        <div className="mt-6 flex justify-end">
                            <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                            <PrimaryButton className="ml-3" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan Barang'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
