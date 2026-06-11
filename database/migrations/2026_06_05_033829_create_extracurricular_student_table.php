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
        Schema::create('extracurricular_student', function (Blueprint $table) {
            $table->uuid('extracurricular_id');
            $table->uuid('student_id');
            $table->timestamps();

            $table->foreign('extracurricular_id')->references('id')->on('extracurriculars')->cascadeOnDelete();
            $table->foreign('student_id')->references('id')->on('students')->cascadeOnDelete();

            $table->primary(['extracurricular_id', 'student_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('extracurricular_student');
    }
};
