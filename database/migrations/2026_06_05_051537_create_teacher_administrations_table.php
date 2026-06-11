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
        Schema::create('teacher_administrations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('semester_id');
            $table->uuid('teacher_id');
            $table->uuid('subject_id');
            $table->string('prota_path')->nullable();
            $table->string('promes_path')->nullable();
            $table->string('cp_path')->nullable();
            $table->string('atp_path')->nullable();
            $table->string('modul_path')->nullable();
            $table->timestamps();

            $table->unique(['semester_id', 'teacher_id', 'subject_id'], 'admin_unique_index');

            $table->foreign('semester_id')->references('id')->on('semesters')->onDelete('cascade');
            $table->foreign('teacher_id')->references('id')->on('teachers')->onDelete('cascade');
            $table->foreign('subject_id')->references('id')->on('subjects')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teacher_administrations');
    }
};
