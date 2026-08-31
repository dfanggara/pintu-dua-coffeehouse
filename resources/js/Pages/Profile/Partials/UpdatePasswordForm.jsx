import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header className="pb-4 mb-6 border-b border-white/10">
                <h2 className="text-base font-bold text-[#FF6B00] uppercase tracking-wider flex items-center gap-2">
                    <span className="material-symbols-outlined text-xl">lock</span>
                    <span>Perbarui Kata Sandi</span>
                </h2>

                <p className="mt-1 text-xs text-[#E0E0E0]/60">
                    Pastikan akun Anda menggunakan kata sandi yang kuat dan aman.
                </p>
            </header>

            <form onSubmit={updatePassword} className="space-y-4 text-xs">
                <div>
                    <label htmlFor="current_password" className="block font-bold text-[#E0E0E0]/80 mb-1.5 uppercase tracking-wider">
                        Kata Sandi Saat Ini
                    </label>

                    <input
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        type="password"
                        className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-white text-xs focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none"
                        autoComplete="current-password"
                    />

                    {errors.current_password && (
                        <p className="mt-1.5 text-[11px] text-rose-400 font-medium">{errors.current_password}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="block font-bold text-[#E0E0E0]/80 mb-1.5 uppercase tracking-wider">
                        Kata Sandi Baru
                    </label>

                    <input
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-white text-xs focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none"
                        autoComplete="new-password"
                    />

                    {errors.password && (
                        <p className="mt-1.5 text-[11px] text-rose-400 font-medium">{errors.password}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password_confirmation" className="block font-bold text-[#E0E0E0]/80 mb-1.5 uppercase tracking-wider">
                        Konfirmasi Kata Sandi Baru
                    </label>

                    <input
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        type="password"
                        className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-white text-xs focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none"
                        autoComplete="new-password"
                    />

                    {errors.password_confirmation && (
                        <p className="mt-1.5 text-[11px] text-rose-400 font-medium">{errors.password_confirmation}</p>
                    )}
                </div>

                <div className="pt-3 flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-5 py-2.5 rounded-xl bg-[#FF6B00] text-[#121212] font-black text-xs uppercase tracking-wider glow-orange-sm hover:scale-[1.02] transition-all duration-200"
                    >
                        Perbarui Kata Sandi
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0"
                    >
                        <p className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">check_circle</span>
                            <span>Kata Sandi Berhasil Diperbarui!</span>
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
