<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Descriptor extends Model
{
    //
    use HasFactory;

    protected $fillable = [
        'nombre',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];
    public function jurisprudencias()
    {
        return $this->hasMany(Jurisprudencias::class, 'descriptor_id');
    }
}
