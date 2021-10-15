<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    const ACCOUNT_TYPE_CUSTOMER = 0;
    const ACCOUNT_TYPE_SUPPLIER  = 1;

    protected $appends = ['customerTypeString'];

    protected $fillable = [
        'user_id',
        'customer_type',
        'name',
        'mobile',
        'address',
        'note',
    ];

    public function getCustomerTypeStringAttribute()
    {
        switch($this->attributes['customer_type']) {
            case self::ACCOUNT_TYPE_CUSTOMER:
                return "Müştəri";
                break;
            case self::ACCOUNT_TYPE_SUPPLIER:
                return "Tədarikçi";
                break;
        }
        return null;
    }

}
