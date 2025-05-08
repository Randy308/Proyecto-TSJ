<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Contents extends Model
{
    use HasFactory;
    protected $fillable = [
        'contenido',
        'resolution_id'
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'searchtext',
    ];

    // En el modelo Contents
    public function resolution()
    {
        return $this->belongsTo(Resolutions::class, 'resolution_id', 'id');
    }

    public function scopeSearch($query, $search)
    {
        if (!$search) {
            return $query;
        }
        return $query->whereRaw('searchtext @@ plainto_tsquery(\'spanish\', ?)', [$search])
            ->orderByRaw('ts_rank(searchtext, plainto_tsquery(\'spanish\', ?)) DESC', [$search]);
    }

    public function scopeKeyword($query, $search)
    {
        if (!$search) {
            return $query;
        }

        // Escapar simple — mejor aún si usas una función más robusta
        $term = addslashes($search); // o usar pg_escape_literal si estás fuera de Laravel

        $tsquery = "plainto_tsquery('spanish', '{$term}')";

        return $query
            ->select(
                'id',
                'resolution_id',
                DB::raw("ts_headline('spanish', contenido, {$tsquery}) as contexto")
            )
            ->whereRaw("searchtext @@ {$tsquery}")
            ->orderByRaw("ts_rank(searchtext, {$tsquery}) DESC");
    }
}
