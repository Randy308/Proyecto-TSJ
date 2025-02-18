<?php

namespace Database\Seeders;


use Illuminate\Database\Seeder;
use App\Models\Estilos;

class EstilosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $estilos = [
            [
                'nombre' => 'descriptor0',
                'fontFamily' => 'cambria',
                'fontWeight' => 'normal',
                'fontSize' => '26pt',
                'marginLeft' => 0,
                'paddingBottom' => 5,
                'marginTop' => 0,
                'color' => '#000000',
                'fontStyle' => 'normal',
                'textDecoration' => 'none',
                'textAlign' => 'center',
                'tipo' => 'Default',
            ],
            [
                'nombre' => 'descriptor1',
                'fontFamily' => 'cambria',
                'fontWeight' => 'normal',
                'fontSize' => '22pt',
                'marginLeft' => 0,
                'paddingBottom' => 5,
                'marginTop' => 0,
                'color' => '#000000',
                'fontStyle' => 'normal',
                'textDecoration' => 'none',
                'textAlign' => 'center',
                'tipo' => 'Default',
            ],
            [
                'nombre' => 'descriptor2',
                'fontFamily' => 'trebuchet_ms',
                'fontWeight' => 'normal',
                'fontSize' => '16pt',
                'marginLeft' => 2,
                'paddingBottom' => 5,
                'marginTop' => 0,
                'color' => '#000000',
                'fontStyle' => 'normal',
                'textDecoration' => 'none',
                'textAlign' => 'justify',
                'tipo' => 'Default',
            ],
            [
                'nombre' => 'descriptor3',
                'fontFamily' => 'trebuchet_ms',
                'fontWeight' => 'normal',
                'fontSize' => '15pt',
                'marginLeft' => 5,
                'paddingBottom' => 5,
                'marginTop' => 0,
                'color' => '#000000',
                'fontStyle' => 'normal',
                'textDecoration' => 'none',
                'textAlign' => 'justify',
                'tipo' => 'Default',
            ],
            [
                'nombre' => 'descriptor4',
                'fontFamily' => 'trebuchet_ms',
                'fontWeight' => 'normal',
                'fontSize' => '14pt',
                'marginLeft' => 8,
                'paddingBottom' => 5,
                'marginTop' => 0,
                'color' => '#000000',
                'fontStyle' => 'normal',
                'textDecoration' => 'none',
                'textAlign' => 'justify',
                'tipo' => 'Default',
            ],
            [
                'nombre' => 'descriptor5',
                'fontFamily' => 'trebuchet_ms',
                'fontWeight' => 'normal',
                'fontSize' => '13pt',
                'marginLeft' => 11,
                'paddingBottom' => 5,
                'marginTop' => 0,
                'color' => '#000000',
                'fontStyle' => 'normal',
                'textDecoration' => 'none',
                'textAlign' => 'justify',
                'tipo' => 'Default',
            ],
            [
                'nombre' => 'descriptor6',
                'fontFamily' => 'trebuchet_ms',
                'fontWeight' => 'normal',
                'fontSize' => '12pt',
                'marginLeft' => 14,
                'paddingBottom' => 5,
                'marginTop' => 0,
                'color' => '#000000',
                'fontStyle' => 'normal',
                'textDecoration' => 'none',
                'textAlign' => 'justify',
                'tipo' => 'Default',
            ],
            [
                'nombre' => 'restrictor',
                'fontFamily' => 'times_new_roman',
                'fontWeight' => 'normal',
                'fontSize' => '12pt',
                'marginLeft' => 30,
                'paddingBottom' => 0,
                'marginTop' => 10,
                'color' => '#000000',
                'fontStyle' => 'normal',
                'textDecoration' => 'none',
                'textAlign' => 'justify',
                'tipo' => 'Default',
            ],
            [
                'nombre' => 'contenido',
                'fontFamily' => 'times_new_roman',
                'fontWeight' => 'normal',
                'fontSize' => '12pt',
                'marginLeft' => 35,
                'paddingBottom' => 15,
                'marginTop' => 10,
                'color' => '#000000',
                'fontStyle' => 'normal',
                'textDecoration' => 'none',
                'textAlign' => 'justify',
                'tipo' => 'Default',
            ],
        ];

        foreach ($estilos as $estilo) {
            Estilos::create($estilo);
        }
    }
}