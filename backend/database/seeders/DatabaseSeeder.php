<?php

namespace Database\Seeders;

use App\Models\Jurisprudencias;
use App\Models\Resolutions;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();


        Artisan::call('scout:delete-index', ['name' => app(Resolutions::class)->searchableAs()]);
        Artisan::call('manticore:index', ['model' => Resolutions::class]);

        Artisan::call('scout:delete-index', ['name' => app(Jurisprudencias::class)->searchableAs()]);
        Artisan::call('manticore:index', ['model' => Jurisprudencias::class]);

        $this->call([
            PermissionsSeeder::class,
            EstilosSeeder::class,
            DescriptorSeeder::class,
        ]);
    }
}
