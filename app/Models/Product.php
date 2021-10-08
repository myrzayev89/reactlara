<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category_id',
        'name',
        'barcode',
        'stock',
        'pur_price',
        'sel_price',
        'tax',
        'text',
    ];

    public static function imageUploader(\Illuminate\Http\Request $request, $img = null)
    {
        if ($request->hasFile('newImg')) {
            if ($img) {
                Storage::delete($img);
            }
            $folder = date('Y-m-d');
            return $request->file('newImg')->store($folder);
        }
        return null;
    }

    public function images()
    {
        return $this->hasOne(ProductImage::class, 'product_id', 'id');
    }

    public function properties()
    {
        return $this->hasMany(ProductProperty::class, 'product_id', 'id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
