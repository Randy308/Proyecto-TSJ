<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Restrictor extends Model
{
    //
    use HasFactory;

    protected $fillable = [
        'nombre',
    ];
    public function jurisprudencias()
    {
        return $this->hasMany(Jurisprudencias::class, 'descriptor_id');
    }
}
