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
        Schema::create('violations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->date('date')->index();
            $table->uuid('student_id')->index();
            $table->uuid('teacher_id')->nullable()->index();
            $table->enum('violation_type', ['ringan', 'sedang', 'berat'])->index();
            $table->string('category')->nullable();
            $table->text('description');
            $table->text('action_taken')->nullable();
            $table->integer('points')->default(0);
            $table->timestamps();

            $table->foreign('student_id')->references('id')->on('students')->onDelete('cascade');
            $table->foreign('teacher_id')->references('id')->on('teachers')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('violations');
    }
};
