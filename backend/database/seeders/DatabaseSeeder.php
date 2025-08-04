<?php

namespace Database\Seeders;

use App\Models\Jurisprudencia;
use App\Models\Resolution;
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


        Artisan::call('scout:delete-index', ['name' => app(Resolution::class)->searchableAs()]);
        Artisan::call('manticore:index', ['model' => Resolution::class]);

        Artisan::call('scout:delete-index', ['name' => app(Jurisprudencia::class)->searchableAs()]);
        Artisan::call('manticore:index', ['model' => Jurisprudencia::class]);

        $this->call([
            PermissionsSeeder::class,
            EstilosSeeder::class,
            DescriptorSeeder::class,
        ]);
    }
}
