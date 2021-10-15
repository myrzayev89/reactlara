<?php

namespace App\Http\Controllers\Api\Category;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = request()->user();
        $categories = Category::where('user_id', $user->id)->orderBy('id', 'desc')->get();
        return response()->json([
            'success' => true,
            'categories' => $categories
        ]);
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
        $create = Category::create($all);
        if ($create) {
            return response()->json([
                'success' => true,
                'message' => 'Bölmə əlavə edildi'
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Xəta baş verdi!'
            ]);
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
        $category = Category::where('id', $id)->first();
        return response()->json([
            'success' => true,
            'category' => $category
        ]);
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
        $update = Category::where('id', $id)->update($all);
        if ($update) {
            return response()->json([
                'success' => true,
                'message' => 'Bölmə redaktə edildi'
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Xəta baş verdi!'
            ]);
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
        $category = Category::find($id);
        if ($category->products->count()) {
            return response()->json([
                'success' => false,
                'message' => 'Bu Bölməyə aid Mal var!'
            ]);
        }
        $category->delete();
        return response()->json([
            'success' => true,
            'message' => 'Bölmə silindi'
        ]);
    }
}
