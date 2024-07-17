<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoResolucions extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
    ];
    public function resolutions()
    {
        return $this->hasMany(Resolutions::class);
    }
}
