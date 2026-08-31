import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="font-display text-2xl uppercase tracking-wider text-white">
                        Pengaturan Profil Admin
                    </h2>
                    <p className="text-xs text-[#E0E0E0]/60">
                        Kelola data diri, kredensial email, dan kata sandi akun administrator Pintu Dua
                    </p>
                </div>
            }
        >
            <Head title="Edit Profil Admin | Pintu Dua" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    {/* Section 1: Information Profile */}
                    <div className="bg-[#181818] p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-2xl"
                        />
                    </div>

                    {/* Section 2: Update Password */}
                    <div className="bg-[#181818] p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl">
                        <UpdatePasswordForm className="max-w-2xl" />
                    </div>

                    {/* Section 3: Delete Account */}
                    <div className="bg-[#181818] p-6 sm:p-8 rounded-2xl border border-rose-500/20 shadow-2xl">
                        <DeleteUserForm className="max-w-2xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
