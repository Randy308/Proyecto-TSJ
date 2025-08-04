<?php

namespace Database\Seeders;

use App\Models\Departamento;
use App\Models\GrupoSala;
use App\Models\Jurisprudencia;
use App\Models\Resolution;
use App\Models\Sala;
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


        // Crear los grupos
        $grupos = [
            'Materia Civil',
            'Materia Penal',
            'Sala Plena',
            'Materia Contenciosa y Contenciosa Administrativa Social y Administrativa Primera',
            'Materia Contenciosa y Contenciosa Administrativa Social y Administrativa Segunda'
        ];

        // Guardar grupos y mapearlos por nombre para uso rápido
        $grupoMap = [];
        foreach ($grupos as $nombre) {
            $grupo = GrupoSala::firstOrCreate(['nombre' => $nombre]);
            $grupoMap[$nombre] = $grupo->id;
        }

        // Salas con su grupo correspondiente
        $salasConGrupo = [
            'Desconocido' => 'Materia Civil',
            'Civil' => 'Materia Civil',
            'Civil I' => 'Materia Civil',
            'Civil II' => 'Materia Civil',
            'Civil Liquidadora' => 'Materia Civil',

            'Penal' => 'Materia Penal',
            'Penal I' => 'Materia Penal',
            'Penal II' => 'Materia Penal',
            'Penal Liquidadora' => 'Materia Penal',

            'Plena' => 'Sala Plena',

            'Social' => 'Materia Contenciosa y Contenciosa Administrativa Social y Administrativa Primera',
            'Social 1era' => 'Materia Contenciosa y Contenciosa Administrativa Social y Administrativa Primera',
            'Social Liquidadora' => 'Materia Contenciosa y Contenciosa Administrativa Social y Administrativa Primera',
            'Social 1era Liquidadora' => 'Materia Contenciosa y Contenciosa Administrativa Social y Administrativa Primera',

            'Social 2da' => 'Materia Contenciosa y Contenciosa Administrativa Social y Administrativa Segunda',
            'Social 2da Liquidadora' => 'Materia Contenciosa y Contenciosa Administrativa Social y Administrativa Segunda',
        ];

        // Crear las salas y asignarlas al grupo
        foreach ($salasConGrupo as $salaNombre => $grupoNombre) {
            Sala::firstOrCreate([
                'nombre' => $salaNombre
            ], [
                'grupo_sala_id' => $grupoMap[$grupoNombre]
            ]);
        }


        $departamentos = [
            'Oruro',
            'La Paz',
            'Chuquisaca',
            'Santa Cruz',
            'Potosí',
            'Cochabamba',
            'Tarija',
            'Beni',
            'Pando',
            'Desconocido'
        ];
        foreach ($departamentos as $nombre) {
            Departamento::firstOrCreate(['nombre' => $nombre]);
        }
    }
}
