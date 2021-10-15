<?php

namespace App\Http\Controllers\Api\Product;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductProperty;
use Illuminate\Http\Request;

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
        $product = Product::where('user_id', $user->id)->orderBy('id', 'desc')->get();
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
        return response()->json(['success' => true, 'categories' => $categories]);
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
            if ($request->hasFile('img')) {
                foreach ($request->file('img') as $item) {
                    $folder = date('Y-m-d');
                    $name = $folder.'/'.time().rand(1, 100).'.'.$item->extension();
                    $item->move(public_path("uploads/$folder"), $name);
                    ProductImage::create([
                        'product_id' => $create->id,
                        'image_path' => $name
                    ]);
                }
            }
            foreach ($properties as $property) {
                ProductProperty::create([
                    'product_id' => $create->id,
                    'property' => $property['property'],
                    'value' => $property['value']
                ]);
            }
            return response()->json(['success' => true, 'message' => 'Mal əlavə edildi']);
        } else {
            return response()->json(['success' => false, 'message' => 'Xəta baş vredi!']);
        }
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
        $file = (isset($all['img'])) ? json_decode($all['img'],true) : [];
        foreach ($file as $img) {
            if (isset($img['isRemove'])) {
                try {
                    $len = strlen(env('IMAGE_URL'));
                    $new_path = substr($img['image_path'], $len, strlen($img['image_path'])-$len);
                    unlink("uploads/$new_path");
                }
                catch(\Exception $e){
                    $e->getMessage();
                }
                ProductImage::where('id', $img['id'])->delete();
            }
        }
        if ($request->hasFile('newImg')) {
            foreach ($request->file('newImg') as $item) {
                $folder = date('Y-m-d');
                $name = $folder.'/'.time().rand(1, 100).'.'.$item->extension();
                $item->move(public_path("uploads/$folder"), $name);
                ProductImage::create([
                    'product_id' => $id,
                    'image_path' => $name
                ]);
            }
        }
        ProductProperty::where('product_id', $id)->delete();
        foreach ($properties as $property) {
            ProductProperty::create([
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
            return response()->json(['success' => true, 'message' => 'Mal redaktə edildi']);
        } else {
            return response()->json(['success' => false, 'message' => 'Xəta baş vredi!']);
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
        if ($product->images) {
            try {
                foreach ($product->images as $img) {
                    $len = strlen(env('IMAGE_URL'));
                    $new_path = substr($img['image_path'], $len, strlen($img['image_path'])-$len);
                    unlink("uploads/$new_path");
                }
            } catch (\Exception $e) {
                $e->getMessage();
            }
            $product->images()->delete();
        }
        if ($product->properties) {
            $product->properties()->delete();
        }
        $product->delete();
        return response()->json(['success' => true, 'message' => 'Mal Silindi']);
    }
}
