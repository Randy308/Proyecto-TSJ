<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoJurisprudencia extends Model
{
    use HasFactory;
    protected $table = 'tipo_jurisprudencias';
    protected $fillable = [
        'nombre',
    ];
    public function jurisprudencias()
    {
        return $this->hasMany(Jurisprudencias::class);
    }
}
