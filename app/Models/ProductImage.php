<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'image_path'
    ];

    public function getImagePathAttribute()
    {
        return asset('uploads/'.$this->attributes['image_path']);
    }
}
