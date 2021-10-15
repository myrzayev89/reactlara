<?php

namespace App\Http\Controllers\Api\Stock;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Stock;
use Carbon\Carbon;
use Illuminate\Http\Request;

class StockController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = request()->user();
        $stocks = Stock::where('user_id', $user->id)
                ->with('product')
                ->orderBy('id', 'desc')
                ->get();
        return response()->json(['success' => true, 'stocks' => $stocks]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $user = request()->user();
        $products = Product::where('user_id', $user->id)->get();
        $stockTypes = [
            ['id' => Stock::ENTRY, 'name' => 'Giriş'],
            ['id' => Stock::OUT, 'name' => 'Çıxış']
        ];
        return response()->json(['success' => true, 'products' => $products, 'stockTypes' => $stockTypes]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $user = request()->user();
        $all = $request->all();
        $all['user_id'] = $user->id;
        $create = Stock::create($all);
        if ($create) {
            switch ($all['stock_type']) {
                case Stock::ENTRY:
                    Product::find($all['product_id'])->increment('stock', $all['qty']);
                    break;
                case Stock::OUT:
                    Product::find($all['product_id'])->decrement('stock', $all['qty']);
                    break;
            }
            return response()->json(['success'=>true, 'message'=>'Stok əlavə edildi']);
        } else {
            return response()->json(['success'=>false, 'message'=>'Xəta baş verdi!']);
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $user = request()->user();
        $stock = Stock::findOrFail($id);
        $products = Product::where('user_id', $user->id)->get();
        $stockTypes = [
            ['id' => Stock::ENTRY, 'name' => 'Giriş'],
            ['id' => Stock::OUT, 'name' => 'Çıxış']
        ];
        return response()->json(['success' => true, 'stock' =>  $stock, 'products' => $products, 'stockTypes' => $stockTypes]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $stock = Stock::findOrFail($id);
        $all = $request->all();
        unset($all['_method']);
        $update = $stock->update($request->all());
        if ($update) {
            switch ($all['stock_type']) {
                case Stock::ENTRY:
                    Product::find($all['product_id'])->increment('stock', $all['qty']);
                    break;
                case Stock::OUT:
                    Product::find($all['product_id'])->decrement('stock', $all['qty']);
                    break;
            }
            return response()->json(['success'=>true, 'message'=>'Stok redaktə edildi']);
        } else {
            return response()->json(['success'=>false, 'message'=>'Xəta baş verdi!']);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $stock = Stock::findOrFail($id);
        $stock->delete();
        return response()->json(['success'=>true, 'message'=>'Stok silindi']);
    }
}
