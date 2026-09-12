<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('activity_logs', function (Blueprint $table) {
            // Tambahkan kolom user_name statis
            $table->string('user_name')->nullable()->after('user_id');
            // Cabut aturan cascade lama
            $table->dropForeign(['user_id']);
        });

        Schema::table('activity_logs', function (Blueprint $table) {
            // Izinkan user_id menjadi null
            $table->unsignedBigInteger('user_id')->nullable()->change();
            // Pasang aturan baru: set null saat user dihapus
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_name');
        });

        Schema::table('activity_logs', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable(false)->change();
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });
    }
};
