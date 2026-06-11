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
        Schema::table('students', function (Blueprint $table) {
            $table->string('tempat_lahir')->nullable()->after('gender');
            $table->date('tanggal_lahir')->nullable()->after('tempat_lahir');
            $table->string('agama')->nullable()->after('tanggal_lahir');
            $table->text('alamat')->nullable()->after('agama');
            $table->string('no_telepon')->nullable()->after('alamat');
            $table->string('nama_ayah')->nullable()->after('no_telepon');
            $table->string('nama_ibu')->nullable()->after('nama_ayah');
            $table->string('nama_wali')->nullable()->after('nama_ibu');
            $table->string('no_telepon_ortu')->nullable()->after('nama_wali');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn([
                'tempat_lahir',
                'tanggal_lahir',
                'agama',
                'alamat',
                'no_telepon',
                'nama_ayah',
                'nama_ibu',
                'nama_wali',
                'no_telepon_ortu'
            ]);
        });
    }
};
