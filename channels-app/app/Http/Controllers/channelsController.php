<?php

namespace App\Http\Controllers;

use App\Models\Channel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class channelsController extends Controller
{
    //Funkcja wyświetlająca stronę główną
    public function index()
    {
        $channels = Channel::all();
        return Inertia::render('index', ['channels' => $channels]);
    }

    // Funkcja wyświetlająca formularz do tworzenia nowego kanału
    public function create()
    {
        return Inertia::render('addView');
    }

    //Funkcja zapisująca nowy kanał do bazy
    public function store(Request $request)
    {
        // Walidacja 
        $validatedData = $request->validate([
            'name' => 'required|unique:channels',
            'customers' => 'required',
        ]);

        // Tworzenie nowego kanału
        $channel = new Channel;
        $channel->name = $validatedData['name'];
        $channel->customers = $validatedData['customers'];

        $channel->save();

    }

    // Funkcja wyświetlająca formularz do aktualizacji kanału
    public function edit($id)
    {
        $channel = Channel::findOrFail($id);
        return Inertia::render('editView', ['channel' => $channel]);
    }

    //Funkcja aktualizująca kanał 
    public function update(Request $request, $id)
    {
        try {
            //Walidacja
            $validatedData = $request->validate([
                'name' => 'required|unique:channels,name,' . $id,
                'customers' => 'required',
            ]);

            //Szukanie kanału o podanym id
            $channel = Channel::findOrFail($id);

            //Sprawdzanie czy nazwa nie powiela się w bazie jeśli tak zwraca kod 422
            $existingChannel = Channel::where('name', $validatedData['name'])
                ->where('id', '!=', $id)
                ->first();
            if ($existingChannel) {
                return response()->json(422);
            }

            //Akutalizacja jeśli walidacja przeszła pomyślnie
            $channel->name = $validatedData['name'];
            $channel->customers = $validatedData['customers'];
            $channel->update([
                'name' => $validatedData['name'],
                'customers' => $validatedData['customers'],
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Wystąpił błąd podczas aktualizacji'], 500);
        }
    }


    //Funckja usuwania kanału
    public function delete($id)
    {
        try {
            // Znajdź i usuń istniejący kanał na podstawie ID
            $channel = Channel::findOrFail($id);
            $channel->delete();

            return response()->json(['message' => 'Kanał został pomyślnie usunięty.']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Wystąpił błąd podczas usuwania kanału.'], 500);
        }
    }
}
