<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ModifyMenuTypeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if(!Schema::hasTable('menu_type'))
        {

            Schema::table('menu_type', function (Blueprint $table) {
                $table->string('menu_type_icon', 255)->nullable()->change();
            });
            
        }
    }

    public function down()
    {
        Schema::table('menu_type', function (Blueprint $table) {
            $table->string('menu_type_icon',255)->nullable()->change(); 
        });
    }
}