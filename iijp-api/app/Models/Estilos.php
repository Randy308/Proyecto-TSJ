<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Estilos extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'fontFamily',
        'textAlign',
        'fontStyle',
        'fontWeight',
        'textDecoration',
        'color',
        'marginTop',
        'paddingBottom',
        'marginLeft',
        'fontSize',
        'tipo'
    ];


    public function users()
    {
        return $this->belongsToMany(User::class, 'user_estilos');
    }
}