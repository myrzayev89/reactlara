<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = request()->user();
        $customers = Customer::where('user_id', $user->id)->orderBy('id', 'desc')->get();
        return response()->json(['success' => true, 'customers' => $customers]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
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
        $create = Customer::create($all);
        if ($create) {
            return response()->json(['success'=>true, 'message'=>'Hesap əlvə edildi']);
        }
        else {
            return response()->json(['success'=>false, 'message'=>'Xəta baş verdi!']);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $customer = Customer::where('id', $id)->first();
        return response()->json(['success' => true, 'customer' => $customer]);
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
        $all = $request->all();
        unset($all['_method']);
        $update = Customer::where('id', $id)->update($all);
        if ($update) {
            return response()->json(['success'=>true, 'message'=>'Hesap redaktə edildi']);
        }
        else {
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
        $customer = Customer::find($id);
        $customer->delete();
        return response()->json(['success'=>true, 'message'=>'Hesap silindi']);
    }
}
