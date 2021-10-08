<?php

namespace App\Http\Controllers\Api\Product;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductProperty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = request()->user();
        $product = Product::orderBy('id', 'desc')->get();
        return response()->json(['success' => true, 'user' => $user, 'product' => $product]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $user = request()->user();
        $categories = Category::where('user_id', $user->id)->orderBy('id', 'desc')->get();
        return response()->json([
            'success' => true,
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $user = request()->user();
        $all = $request->all();
        $properties = (isset($all['property'])) ? json_decode($all['property'], true) : [];
        unset($all['img']);
        unset($all['property']);
        $all['user_id'] = $user->id;
        $create = Product::create($all);
        if ($create) {
            $upload = Product::imageUploader($request);
            if ($request->img) {
                ProductImage::create([
                    'product_id' => $create->id,
                    'image_path' => $upload
                ]);
            }
            foreach ($properties as $property) {
                ProductProperty::create([
                    'product_id' => $create->id,
                    'property' => $property['property'],
                    'value' => $property['value']
                ]);
            }
            return response()->json([
                'success' => true,
                'message' => 'Mal əlavə edildi'
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Xəta baş vredi!'
            ]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $user = request()->user();
        $product = Product::with(['images', 'properties'])->find($id);
        $categories = Category::where('user_id', $user->id)->get();
        return response()->json([
            'product' => $product,
            'categories' => $categories,
            'success' => true
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $all = $request->all();
        $properties = (isset($all['property'])) ? json_decode($all['property'], true) : [];
        if ($request->hasFile('newImg')) {
            $upload = Product::imageUploader($request, $all['img']);
            ProductImage::where('product_id', $id)->update([
                'product_id' => $id,
                'image_path' => $upload
            ]);
        }
        foreach ($properties as $property) {
            ProductProperty::where('product_id', $id)->update([
                'product_id' => $id,
                'property' => $property['property'],
                'value' => $property['value']
            ]);
        }
        unset($all['img']);
        unset($all['newImg']);
        unset($all['property']);
        unset($all['_method']);
        $update = Product::where('id', $id)->update($all);
        if ($update) {
            return response()->json([
                'success' => true,
                'message' => 'Mal redaktə edildi'
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Xəta baş vredi!'
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $product = Product::find($id);
        $images = $product->productImages;
        if ($images) {
            Storage::delete($images->image_path);
            $product->productImages()->delete();
        }
        $property = $product->productProperties;
        if ($property) {
            $product->productProperties()->delete();
        }
        $product->delete();
        return response()->json([
            'success' => true,
            'message' => 'Mal Silindi'
        ]);
    }
}
