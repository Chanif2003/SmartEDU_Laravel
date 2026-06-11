import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, Transition } from '@headlessui/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function PaymentModal({ show, onClose, payment }) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        student_id: '',
        billing_month: '',
        amount: '',
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'Tunai',
        notes: '',
    });

    useEffect(() => {
        if (payment) {
            setData({
                student_id: payment.student_id,
                billing_month: payment.billing_month,
                amount: Math.round(payment.amount), // Convert decimal string to number
                payment_date: new Date().toISOString().split('T')[0],
                payment_method: 'Tunai',
                notes: payment.notes || '',
            });
        }
    }, [payment]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.finance.spp.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    if (!payment) return null;

    return (
        <Transition show={show} as={React.Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-md rounded bg-white p-6 shadow-xl">
                        <Dialog.Title className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                            Proses Pembayaran SPP
                        </Dialog.Title>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <InputLabel value="Siswa" />
                                <div className="mt-1 block w-full p-2 bg-gray-100 rounded-md text-sm border border-gray-300">
                                    {payment.student?.nama_lengkap} ({payment.student?.nisn})
                                </div>
                            </div>

                            <div>
                                <InputLabel value="Bulan Tagihan" />
                                <div className="mt-1 block w-full p-2 bg-gray-100 rounded-md text-sm border border-gray-300">
                                    {payment.billing_month}
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="amount" value="Nominal Pembayaran (Rp)" />
                                <TextInput
                                    id="amount"
                                    type="number"
                                    className="mt-1 block w-full"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    required
                                    min="0"
                                />
                                {errors.amount && <div className="text-red-500 text-xs mt-1">{errors.amount}</div>}
                            </div>

                            <div>
                                <InputLabel htmlFor="payment_date" value="Tanggal Pembayaran" />
                                <TextInput
                                    id="payment_date"
                                    type="date"
                                    className="mt-1 block w-full"
                                    value={data.payment_date}
                                    onChange={(e) => setData('payment_date', e.target.value)}
                                    required
                                />
                                {errors.payment_date && <div className="text-red-500 text-xs mt-1">{errors.payment_date}</div>}
                            </div>

                            <div>
                                <InputLabel htmlFor="payment_method" value="Metode Pembayaran" />
                                <select
                                    id="payment_method"
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    value={data.payment_method}
                                    onChange={(e) => setData('payment_method', e.target.value)}
                                >
                                    <option value="Tunai">Tunai</option>
                                    <option value="Transfer Bank">Transfer Bank</option>
                                </select>
                                {errors.payment_method && <div className="text-red-500 text-xs mt-1">{errors.payment_method}</div>}
                            </div>

                            <div>
                                <InputLabel htmlFor="notes" value="Catatan (Opsional)" />
                                <TextInput
                                    id="notes"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                />
                                {errors.notes && <div className="text-red-500 text-xs mt-1">{errors.notes}</div>}
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <SecondaryButton onClick={handleClose}>Batal</SecondaryButton>
                                <PrimaryButton type="submit" disabled={processing}>
                                    {processing ? 'Memproses...' : 'Simpan Pembayaran'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </Transition>
    );
}
