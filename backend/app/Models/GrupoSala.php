<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GrupoSala extends Model
{
    use HasFactory;

    protected $table = 'grupo_salas';

    protected $fillable = ['nombre'];

    // Relación: Un grupo tiene muchas salas
    public function salas()
    {
        return $this->hasMany(Sala::class, 'grupo_sala_id');
    }
}
