<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Spatie\SimpleExcel\SimpleExcelReader;

class DescriptorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $fullPath = storage_path('app/descriptor.csv');
        $rows = SimpleExcelReader::create($fullPath)->getRows();

        $dataToInsert = [];
        $chunkSize = 500;

        foreach ($rows as $index => $row) {
            try {
                // Preprocesar fila
                $dataToInsert[] = [
                    'id' => $row['id'] !== '' ? $row['id'] : null,
                    'nombre' => $row['nombre'] !== '' ? $row['nombre'] : 'Desconocido',
                    'descriptor_id' => $row['descriptor_id'] !== '' ? $row['descriptor_id'] : null,
                ];

                // Insertar en lotes
                if (count($dataToInsert) >= $chunkSize) {
                    DB::table('descriptors')->insert($dataToInsert);
                    $dataToInsert = [];
                }
            } catch (\Throwable $e) {
                Log::error("Error en fila {$index}: " . $e->getMessage(), [
                    'row' => $row
                ]);
            }
        }

        // Insertar cualquier remanente
        if (!empty($dataToInsert)) {
            try {
                DB::table('descriptors')->insert($dataToInsert);
            } catch (\Throwable $e) {
                Log::error("Error al insertar lote final: " . $e->getMessage(), [
                    'rows' => $dataToInsert
                ]);
            }
        }
    }
}
