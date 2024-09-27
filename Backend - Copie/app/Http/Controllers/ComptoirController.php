<?php

namespace App\Http\Controllers;

use App\Models\Comptoir;
use Illuminate\Http\Request;

class ComptoirController extends Controller
{
    //
    public function ajouter_comptoir(Request $request) {
        // Validation des données
        $validated = $request->validate([
            'nomSociete' => 'required|string|max:255',
            'adresse' => 'required|string|max:255',
            'nifStat' => 'required|string|max:255',
            'dateOuverture' => 'required|date',
            'directeur' => 'required|string|max:255',
            'validation' => 'required|string|max:255',
            'stockComptoir' => 'required|numeric',
            'file' => 'required|max:2048', // Si compteId est optionnel
        ]);
    
        // Gérer l'upload de l'image
        if ($request->hasFile('file')) {
            $image = $request->file('file');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('uploads/comptoirs'), $imageName);
            $validated['arrete'] = '/uploads/comptoirs/' . $imageName; // Assigner le chemin à l'attribut 'arrete'
        }
    
        // Création du nouvel enregistrement dans le modèle Comptoir
        Comptoir::create([
            'nomSociete' => $validated['nomSociete'],
            'adresse' => $validated['adresse'],
            'nifStat' => $validated['nifStat'],
            'dateOuverture' => $validated['dateOuverture'],
            'directeur' => $validated['directeur'],
            'validation' => $validated['validation'],
            'stockComptoir' => $validated['stockComptoir'],
            'arrete' => $validated['arrete'],
        ]);
    
        return response()->json(['message' => 'Comptoir ajouté avec succès!'], 201);
    }
    
}
