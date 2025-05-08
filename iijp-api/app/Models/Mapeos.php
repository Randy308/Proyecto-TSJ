<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mapeos extends Model
{
    use HasFactory;
    protected $fillable = [
        'external_id',
        'resolution_id'
    ];
    
    
    protected $hidden = [
        'created_at',
        'updated_at',
    ];
    public function resolution()
    {
        return $this->belongsTo(Resolutions::class);
    }
}
