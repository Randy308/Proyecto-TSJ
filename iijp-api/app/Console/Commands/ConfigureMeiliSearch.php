<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use MeiliSearch\Client;

class ConfigureMeiliSearch extends Command
{
    protected $signature = 'meilisearch:configure';
    protected $description = 'Configura atributos filtrables en el índice de MeiliSearch';

    public function handle()
    {
        $client = new Client(config('scout.meilisearch.host'), config('scout.meilisearch.key'));

        $index = $client->index('resolutions'); // nombre del índice (usualmente el nombre de tu modelo en plural)

        $index->updateSettings([
            'filterableAttributes' => [
                'id',
                'sala',
                'magistrado',
                'tipo_resolucion',
                'forma_resolucion',
                'departamento',
                'periodo',
                'tiene_jurisprudencias'
            ],
            'searchableAttributes' => [
                'contenido',
                'demandante',
                'demandado',
                'nro_resolucion',
                'nro_expediente',
                'sintesis',
                'precedente',
                'proceso',
                'maxima',
            ],
            'sortableAttributes' => [
                'periodo',
            ],
            'rankingRules' => [
                'words',
                'typo',
                'proximity',
                'attribute',
                'exactness',
            ],
        ]);



        $index_2 = $client->index('jurisprudencias'); // nombre del índice (usualmente el nombre de tu modelo en plural)


        $index_2->updateSettings([
            'filterableAttributes' => [
                'materia',
                'descriptor_id',
                'tipo_jurisprudencia',
                'id',
                'periodo',
                'tipo_resolucion',
                'sala',
                'departamento',
                'nro_resolucion',
                'descriptor', // también como faceta
                'descriptor_facet',
                'nro_expediente',
                'magistrado',
                'forma_resolucion',
            ],
            'searchableAttributes' => [
                'descriptor',
                'ratio',
                'restrictor',
                'precedente',
                'proceso',
                'maxima',
                'sintesis',
            ],
            'sortableAttributes' => [
                'periodo',
            ],
            'distinctAttribute' => 'resolution_id',

            'rankingRules' => [
                'words',
                'typo',
                'proximity',
                'attribute',
                'exactness',
            ],
        ]);




        $this->info('Atributos filtrables configurados correctamente en MeiliSearch.');
    }
}
