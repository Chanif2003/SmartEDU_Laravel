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
        Schema::table('teachers', function (Blueprint $table) {
            $table->enum('gender', ['L', 'P'])->nullable()->after('nama_lengkap');
            $table->string('qr_code')->unique()->nullable()->after('gender');
        });

        Schema::table('students', function (Blueprint $table) {
            $table->string('nis')->unique()->nullable()->after('nisn');
            $table->enum('gender', ['L', 'P'])->nullable()->after('nama_lengkap');
            $table->string('qr_code')->unique()->nullable()->after('gender');
            $table->boolean('is_active')->default(true)->after('qr_code');
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('teachers', function (Blueprint $table) {
            $table->dropColumn(['gender', 'qr_code']);
        });

        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn(['nis', 'gender', 'qr_code', 'is_active']);
            $table->dropSoftDeletes();
        });
    }
};
