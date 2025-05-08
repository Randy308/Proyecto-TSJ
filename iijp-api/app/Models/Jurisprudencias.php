<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jurisprudencias extends Model
{
    use HasFactory;

    protected $fillable = [
        'restrictor_id',
        'resolution_id',
        'descriptor_id',
        'descriptor',
        'tipo_jurisprudencia_id',
        'ratio',
        'root_id',
    ];
    
    
    protected $hidden = [
        'created_at',
        'updated_at',
    ];
    
    public function resolution()
    {
        return $this->hasOne(Resolutions::class);
    }


    public function tipo_jurisprudencia()
    {
        return $this->belongsTo(TipoJurisprudencia::class, 'tipo_jurisprudencia_id');
    }

    public function restrictor()
    {
        return $this->belongsTo(Restrictor::class, 'restrictor_id');
    }
    public function descriptor()
    {
        return $this->belongsTo(Descriptor::class, 'descriptor_id');
    }
}
