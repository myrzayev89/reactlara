<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Stock
 * @package App\Models
 * @mixin Builder
 */
class Stock extends Model
{
    use HasFactory;

    const ENTRY = 1;
    const OUT = 0;

    protected $appends = ['stockTypeString'];

    protected $fillable = ['user_id', 'stock_type', 'product_id', 'qty', 'total_price', 'date', 'note'];

    public function product()
    {
        return $this->hasOne(Product::class, 'id', 'product_id');
    }

    public function getStockTypeStringAttribute()
    {
        switch ($this->attributes['stock_type']) {
            case self::ENTRY:
                return 'Stok Giriş';
                break;
            case self::OUT:
                return 'Stok Çıxış';
                break;
        }
        return null;
    }

    public function getDateAttribute()
    {
        return Carbon::make($this->attributes['date'])->format('d.m.Y');
    }
}
