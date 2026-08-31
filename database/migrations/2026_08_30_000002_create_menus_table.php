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
        Schema::create('menus', function (Blueprint $table) {
            $table->string('sku')->primary();
            $table->string('category_slug');
            $table->string('name');
            $table->text('description')->nullable();
            $table->integer('price');
            $table->text('image_url')->nullable();
            $table->boolean('is_highlight')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('category_slug')
                  ->references('slug')
                  ->on('categories')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menus');
    }
};
