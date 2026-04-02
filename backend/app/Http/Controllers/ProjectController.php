<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Pest\Support\Str;

class ProjectController extends Controller
{

    public function index()
    {
        $projects = Project::get();

        return response()->json(['data' => $projects], 200);
    }

    public function store(Request $request)
    {
        $validate = $request->validate([
            'title' => 'required|string|max:110',
            'category' => 'required|string|max:110',
            'thumbnail' => 'required|string',
            'videoUrl' => 'required|string',
        ]);

        $project = Project::create($validate);

        return response()->json(['data' => $project], 200);
    }

    public function show(Project $project)
    {
        $project = Project::where('id', $project->id)->first();

        if (!$project) {
            return response()->json(['message' => 'Project Not Found!'], 404);
        }

        return response()->json(['data' => $project], 200);
    }

    public function update(Request $request, Project $project)
    {
        //
    }

    public function destroy(Project $project)
    {
        $project = Project::where('id', $project->id)->first();

        if (!$project) {
            return response()->json(['message' => 'Project Not Found!'], 404);
        }

        $project->delete();

        return response()->json(['message' => 'Done Deleted.'], 200);
    }

    public function uploadAudio(Request $request)
    {
        $file = $request->file('audio');

        $filename = time() . '_' . $file->getClientOriginalName();
        $path = $file->move(public_path('uploads/demos'), $filename);

        return response()->json([
            'success' => true,
            'url' => asset('uploads/demos/' . $filename),
        ]);
    }

    /**
     * رفع ملف فيديو
     */
    public function uploadVideo(Request $request)
    {
        $file = $request->file('video');

        // التحقق من نوع الملف
        $allowedTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'];
        if (!in_array($file->getMimeType(), $allowedTypes)) {
            return response()->json([
                'success' => false,
                'message' => 'نوع الملف غير مدعوم. الأنواع المدعومة: MP4, MOV, AVI'
            ], 400);
        }

        // التحقق من حجم الملف (الحد الأقصى 200MB)
        $maxSize = 200 * 1024 * 1024; // 200 MB
        if ($file->getSize() > $maxSize) {
            return response()->json([
                'success' => false,
                'message' => 'حجم الفيديو كبير جداً. الحد الأقصى 200MB'
            ], 400);
        }

        $filename = time() . '_' . Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path = $file->move(public_path('uploads/videos'), $filename);

        return response()->json([
            'success' => true,
            'url' => asset('uploads/videos/' . $filename),
        ]);
    }

    /**
     * رفع صورة مصغرة
     */
    public function uploadThumbnail(Request $request)
    {
        $file = $request->file('thumbnail');

        $allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (!in_array($file->getMimeType(), $allowedTypes)) {
            return response()->json([
                'success' => false,
                'message' => 'نوع الملف غير مدعوم. الأنواع المدعومة: JPG, PNG, WEBP'
            ], 400);
        }

        $maxSize = 5 * 1024 * 1024; // 5 MB
        if ($file->getSize() > $maxSize) {
            return response()->json([
                'success' => false,
                'message' => 'حجم الصورة كبير جداً. الحد الأقصى 5MB'
            ], 400);
        }

        $filename = time() . '_' . Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path = $file->move(public_path('uploads/thumbnails'), $filename);

        return response()->json([
            'success' => true,
            'url' => asset('uploads/thumbnails/' . $filename),
        ]);
    }
}
