import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header className="pb-4 border-b border-white/10">
                <h2 className="text-base font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                    <span className="material-symbols-outlined text-xl">delete_forever</span>
                    <span>Hapus Akun Administrator</span>
                </h2>

                <p className="mt-1 text-xs text-[#E0E0E0]/60">
                    Setelah akun Anda dihapus, semua data dan akses administrator Anda akan dihapus secara permanen.
                </p>
            </header>

            <button
                type="button"
                onClick={confirmUserDeletion}
                className="px-4 py-2.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200"
            >
                Hapus Akun Admin
            </button>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6 bg-[#181818] border border-white/10 text-xs space-y-4">
                    <div className="flex items-center gap-3 text-rose-400">
                        <span className="material-symbols-outlined text-3xl">warning</span>
                        <h2 className="text-base font-bold uppercase tracking-wider text-white">
                            Apakah Anda yakin ingin menghapus akun?
                        </h2>
                    </div>

                    <p className="text-[#E0E0E0]/70 leading-relaxed">
                        Tindakan ini permanen. Silakan masukkan kata sandi Anda untuk mengonfirmasi penghapusan akun admin secara permanen.
                    </p>

                    <div>
                        <label htmlFor="password" className="block font-bold text-[#E0E0E0]/80 mb-1.5 uppercase tracking-wider">
                            Kata Sandi Konfirmasi
                        </label>

                        <input
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-white text-xs focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
                            placeholder="Masukkan kata sandi akun Anda..."
                        />

                        {errors.password && (
                            <p className="mt-1.5 text-[11px] text-rose-400 font-medium">{errors.password}</p>
                        )}
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase"
                        >
                            Hapus Permanen
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
