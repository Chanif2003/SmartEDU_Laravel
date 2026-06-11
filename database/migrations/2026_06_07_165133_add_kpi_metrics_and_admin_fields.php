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
        Schema::table('teacher_evaluations', function (Blueprint $table) {
            $table->json('metrics')->nullable()->after('score');
        });

        Schema::table('teacher_administrations', function (Blueprint $table) {
            $table->string('kktp_path')->nullable()->after('modul_path');
            $table->string('lkpd_path')->nullable()->after('kktp_path');
            $table->string('rubrik_path')->nullable()->after('lkpd_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('teacher_evaluations', function (Blueprint $table) {
            $table->dropColumn('metrics');
        });

        Schema::table('teacher_administrations', function (Blueprint $table) {
            $table->dropColumn(['kktp_path', 'lkpd_path', 'rubrik_path']);
        });
    }
};
