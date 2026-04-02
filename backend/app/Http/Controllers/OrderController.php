<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{

    public function index()
    {
        $orders = Order::query()->with('user')->get();

        return response()->json(['data' => $orders, 'count' => $orders->count()], 200);
    }

    public function store(Request $request)
    {
        $user_id = Auth::user()->id;

        $validate = $request->validate([
            'full_name' => 'required|string|max:110',
            'phone' => 'required|string',
            'text' => 'required|string',
            'category' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $validate['user_id'] = $user_id;

        $order = Order::query()->with('user')->create($validate);

        return response()->json(['data' => $order], 200);
    }

    public function show(Order $order)
    {
        $order = Order::query()->with('user')->where('id', $order->id)->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found!'], 404);
        }

        return response()->json(['data' => $order], 200);
    }

    public function update(Request $request, Order $order)
    {
        $order = Order::query()->where('id', $order->id)->first();

        if (!$order) {
            return response()->json(['message' => 'Order Not Found!'], 404);
        }

        $validate = $request->validate([
            'status' => 'required|string'
        ]);

        $order->update($validate);

        return response()->json(['message' => 'Done Update.'], 201);
    }

    public function destroy(Order $order)
    {
        $order = Order::query()->with('user')->where('id', $order->id)->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found!'], 404);
        }

        $order->delete();

        return response()->json(['message' => 'Done Deleted.'], 200);
    }
}
