import React from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';

export default function ConfirmDeleteModal({
    isOpen = false,
    title = 'Konfirmasi Hapus Data',
    message = 'Apakah Anda yakin ingin menghapus data ini secara permanen dari database?',
    confirmText = 'Ya, Hapus Data',
    cancelText = 'Batal',
    onConfirm = () => {},
    onClose = () => {},
}) {
    return (
        <Transition show={isOpen} leave="duration-200">
            <Dialog
                as="div"
                className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
                onClose={onClose}
            >
                {/* Backdrop Blur */}
                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md" />
                </TransitionChild>

                {/* Modal Container */}
                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95 translate-y-4"
                    enterTo="opacity-100 scale-100 translate-y-0"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100 translate-y-0"
                    leaveTo="opacity-0 scale-95 translate-y-4"
                >
                    <DialogPanel className="relative w-full max-w-md bg-[#181818] border border-rose-500/30 rounded-3xl p-6 shadow-[0_0_50px_rgba(244,63,94,0.15)] text-white z-10 overflow-hidden">
                        {/* Glowing Background Accent */}
                        <div className="absolute -top-12 -right-12 w-36 h-36 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 shrink-0">
                                <span className="material-symbols-outlined text-2xl">delete_forever</span>
                            </div>

                            <div className="space-y-1.5 flex-1">
                                <h3 className="font-bold text-base text-white uppercase tracking-wider">
                                    {title}
                                </h3>
                                <p className="text-xs text-[#E0E0E0]/70 leading-relaxed">
                                    {message}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                            >
                                {cancelText}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-all transform hover:scale-105 active:scale-95"
                            >
                                {confirmText}
                            </button>
                        </div>
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}
