<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContenidoParte extends Model
{
    //
    protected $table = "contenido_partes";
    protected $fillable = ['titulo', 'texto', 'resolution_id'];
    public function resolution()
    {
        return $this->belongsTo(Resolution::class);
    }
}
