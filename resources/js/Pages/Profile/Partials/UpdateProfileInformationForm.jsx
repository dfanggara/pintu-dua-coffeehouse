import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header className="pb-4 mb-6 border-b border-white/10">
                <h2 className="text-base font-bold text-[#FF6B00] uppercase tracking-wider flex items-center gap-2">
                    <span className="material-symbols-outlined text-xl">person</span>
                    <span>Informasi Profil Admin</span>
                </h2>

                <p className="mt-1 text-xs text-[#E0E0E0]/60">
                    Perbarui nama lengkap dan alamat surel (email) akun admin Anda.
                </p>
            </header>

            <form onSubmit={submit} className="space-y-4 text-xs">
                <div>
                    <label htmlFor="name" className="block font-bold text-[#E0E0E0]/80 mb-1.5 uppercase tracking-wider">
                        Nama Lengkap Admin
                    </label>

                    <input
                        id="name"
                        type="text"
                        className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-white text-xs focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                    />

                    {errors.name && (
                        <p className="mt-1.5 text-[11px] text-rose-400 font-medium">{errors.name}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="email" className="block font-bold text-[#E0E0E0]/80 mb-1.5 uppercase tracking-wider">
                        Alamat Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-white text-xs focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    {errors.email && (
                        <p className="mt-1.5 text-[11px] text-rose-400 font-medium">{errors.email}</p>
                    )}
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-yellow-400">
                        <p className="text-xs">
                            Alamat email Anda belum terverifikasi.{' '}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="font-bold underline hover:text-white"
                            >
                                Klik di sini untuk mengirim ulang email verifikasi.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-xs font-bold text-emerald-400">
                                Link verifikasi baru telah dikirimkan ke alamat email Anda.
                            </div>
                        )}
                    </div>
                )}

                <div className="pt-3 flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-5 py-2.5 rounded-xl bg-[#FF6B00] text-[#121212] font-black text-xs uppercase tracking-wider glow-orange-sm hover:scale-[1.02] transition-all duration-200"
                    >
                        Simpan Perubahan
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
                            <span>Berhasil Disimpan!</span>
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
