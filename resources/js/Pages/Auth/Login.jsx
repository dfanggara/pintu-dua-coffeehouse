import React from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Masuk Portal Admin | Pintu Dua" />

            <div className="mb-6 text-center">
                <h2 className="font-display text-xl uppercase tracking-wider text-white">
                    Portal Admin Login
                </h2>
                <p className="text-xs text-[#E0E0E0]/60 mt-1">
                    Silakan masuk menggunakan kredensial akun administrator
                </p>
            </div>

            {status && (
                <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400 text-center">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4 text-xs">
                {/* Email Address */}
                <div>
                    <label htmlFor="email" className="block font-bold text-[#E0E0E0]/80 mb-1.5 uppercase tracking-wider">
                        Alamat Email
                    </label>

                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3.5 top-3 text-[#E0E0E0]/40 text-lg">mail</span>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            placeholder="admin@pintudua.com"
                            className="w-full bg-[#121212] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-xs placeholder-[#E0E0E0]/30 focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none"
                            autoComplete="username"
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                    </div>

                    {errors.email && (
                        <p className="mt-1.5 text-[11px] text-rose-400 font-medium">{errors.email}</p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <label htmlFor="password" className="block font-bold text-[#E0E0E0]/80 uppercase tracking-wider">
                            Kata Sandi
                        </label>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-[11px] text-[#FF6B00] hover:underline font-semibold"
                            >
                                Lupa Kata Sandi?
                            </Link>
                        )}
                    </div>

                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3.5 top-3 text-[#E0E0E0]/40 text-lg">lock</span>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            placeholder="Masukkan kata sandi..."
                            className="w-full bg-[#121212] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-xs placeholder-[#E0E0E0]/30 focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                    </div>

                    {errors.password && (
                        <p className="mt-1.5 text-[11px] text-rose-400 font-medium">{errors.password}</p>
                    )}
                </div>

                {/* Remember Me */}
                <div className="pt-1">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded border-white/20 bg-[#121212] text-[#FF6B00] focus:ring-[#FF6B00] focus:ring-offset-0"
                        />
                        <span className="text-xs text-[#E0E0E0]/80 font-medium">
                            Ingat Sesi Saya
                        </span>
                    </label>
                </div>

                {/* Submit Button */}
                <div className="pt-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3.5 rounded-xl bg-[#FF6B00] text-[#121212] font-black text-xs uppercase tracking-wider glow-orange-sm hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <span>Masuk Portal Admin</span>
                        <span className="material-symbols-outlined text-base">login</span>
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
