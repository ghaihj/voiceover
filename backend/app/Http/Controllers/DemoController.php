<?php

namespace App\Http\Controllers;

use App\Models\Demo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DemoController extends Controller
{

    public function index()
    {
        $demos = Demo::query()->get();

        return response()->json(['data' => $demos, 'count' => $demos->count()], 200);
    }

    public function store(Request $request)
    {
        $validate = $request->validate([
            'title' => 'required|string|max:110',
            'category' => 'required|string|max:150',
            'duration' => 'required|string',
            'audio' => 'required|string'
        ]);

        $demo = Demo::create($validate);

        return response()->json(['data' => $demo], 201);
    }

    public function show(Demo $demo)
    {
        $demo = Demo::where('id', $demo->id)->first();

        if (!$demo) {
            return response()->json(['message' => 'Demo Not Found!'], 404);
        }

        return response()->json(['data' => $demo], 200);
    }

    public function update(Request $request, Demo $demo)
    {
        $demo = Demo::where('id', $demo->id)->first();

        $validate = $request->validate([
            'title' => 'required|string|max:110',
            'category' => 'required|string|max:150',
            'duration' => 'required|string',
            'audio' => 'required|string'
        ]);

        if (!$demo) {
            return response()->json(['message' => 'Demo Not Found!'], 404);
        }

        $demo->update($validate);

        return response()->json(['message' => 'Done Updated.'], 200);
    }

    public function destroy(Demo $demo)
    {
        $demo = Demo::where('id', $demo->id)->first();

        if (!$demo) {
            return response()->json(['message' => 'Demo Not Found!'], 404);
        }

        $demo->delete();

        return response()->json(['message' => 'Done Deleted.'], 200);
    }

    public function upload(Request $request)
    {
        // جلب الملف
        $file = $request->file('audio');

        // إنشاء اسم جديد للملف
        $filename = time() . '_' . $file->getClientOriginalName();

        // حفظ الملف في مجلد public/uploads
        $path = $file->move(public_path('uploads/demos'), $filename);

        // إرجاع رابط الملف
        return response()->json([
            'success' => true,
            'url' => asset('uploads/demos/' . $filename),
            'path' => 'uploads/demos/' . $filename
        ]);
    }
}
