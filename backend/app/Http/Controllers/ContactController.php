<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;

use function Pest\Laravel\delete;

class ContactController extends Controller
{

    public function index()
    {
        $contacts = Contact::all();

        return response()->json(['data' => $contacts], 200);
    }

    public function store(Request $request)
    {
        $validate = $request->validate([
            'name' => 'required|string|max:150',
            'email' => 'required|email',
            'phone' => 'required|string|max:30',
            'message' => 'required|string',
            'subject' => 'required|string',
        ]);

        $contact = Contact::create($validate);

        return response()->json(['data' => $contact], 200);
    }

    public function show(Contact $contact)
    {
        $contact = Contact::where('id', $contact->id)->first();

        if (!$contact) {
            return response()->json(['message' => 'Message Not Found!'], 404);
        }

        return response()->json(['data' => $contact], 200);
    }

    public function update(Request $request, Contact $contact)
    {
        $contact = Contact::where('id', $contact->id)->first();

        if (!$contact) {
            return response()->json(['message' => 'Message Not Found!'], 404);
        }

        $validate = $request->validate([
            'status' => 'required|string'
        ]);

        $contact->update($validate);

        return response()->json(['data' => $contact], 200);
    }

    public function destroy(Contact $contact)
    {
        $contact = Contact::where('id', $contact->id)->first();

        if (!$contact) {
            return response()->json(['message' => 'Message Not Found!'], 404);
        }

        $contact->delete();

        return response()->json(['message' => 'Done Deleted.'], 200);
    }
}
