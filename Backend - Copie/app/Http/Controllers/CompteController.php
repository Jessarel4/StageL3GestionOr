<?php

namespace App\Http\Controllers;
use App\Mail\ValidationCodeMail;
use App\Models\Compte;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

use Illuminate\Support\Facades\Mail;
class CompteController extends Controller
{
    //
    public function listecompte(){
        $data = Compte::all();
        return response()->json($data);
    }

    public function ajouter_compte(Request $request)
{
    // Valider les champs
    $validated = $request->validate([
        'utilisateur' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:compte,email',
        'motDePasse' => 'required|string|min:6',
        'role' => 'required|string',
        'file' => 'required|image|max:2048', // Limiter la taille de l'image
    ]);

    // Gérer l'upload de l'image
    if ($request->hasFile('file')) {
        $image = $request->file('file');
        $imageName = time().'_'.$image->getClientOriginalName();
        $image->move(public_path('uploads'), $imageName);
        $validated['photo'] = '/uploads/' . $imageName;
    }

    // Créer le nouveau compte
    Compte::create([
        'utilisateur' => $validated['utilisateur'],
        'email' => $validated['email'],
        'motDePasse' => bcrypt($validated['motDePasse']),
        'photo' => $validated['photo'],
        'role' => $validated['role'],
    ]);

    return response()->json(['message' => 'Compte ajouté avec succès!'], 201);
}

    public function modifie_compte(Request $request,$id)
    {
        //recherche du compte
        try {
            $compte = Compte::find($id);

            if ($compte) {
                // Valider les champs
                $validated = $request->validate([
                    'utilisateur' => 'required|string|max:255',
                    'email' => 'required|string|email|max:255',
                    'motDePasse' => 'nullable|string|min:6',
                    'role' => 'required|string',
                    // 'file' => 'required|image|max:2048', // Limiter la taille de l'image
                ]);
                // Gérer l'upload de l'image
                if ($request->hasFile('file')) {
                    if ($compte->photo) {
                        $photoPath = public_path($compte->photo);
                        if (file_exists($photoPath)) {
                            unlink($photoPath);
                        }
                    }
                    $image = $request->file('file');
                    $imageName = time() . '_' . $image->getClientOriginalName();
                    $image->move(public_path('uploads'), $imageName);
                    $compte->photo = '/uploads/' . $imageName;

                }
                $compte->utilisateur = $validated['utilisateur'];
                $compte->email = $validated['email'];
                if (!empty($validated['motDePasse'])) {
                    $compte->motDePasse = bcrypt($validated['motDePasse']);
                }
                $compte->role = $validated['role'];
                $compte->save();
                return response()->json(['message' => 'Compte mis à jour avec succès !'], 200);
            } else {
                return response()->json(['success' => false, 'message' => 'Compte non trouvé'], 404);
            }
        } catch (\Throwable $th) {

            return response()->json(['success' => false, 'message' => 'Erreur lors de la Modification'], 500);
        }
    }



    public function supression_compte($id)
    {
        try {
            $compte = Compte::find($id);
            if ($compte) {
                $compte->delete();
                // Supprimer la photo si elle existe
                if ($compte->photo) {
                    $photoPath = public_path($compte->photo);
                    if (file_exists($photoPath)) {
                        unlink($photoPath);
                    }
                }
                return response()->json(['success' => true, 'message' => 'Compte supprimé avec succès'],202);
            } else {
                return response()->json(['success' => false, 'message' => 'Compte non trouvé'], 404);
            }
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => 'Erreur lors de la suppression'], 500);
        }
    }

    // public function connexion(Request $request)
    // {
    //     // Valider les champs
    //     $validated = $request->validate([
    //         'email' => 'required|string|email',
    //         'motDePasse' => 'required|string',
    //     ]);

    //     // Rechercher le compte par email
    //     $compte = Compte::where('email', $validated['email'])->first();

    //     // Vérifier si le compte existe et si le mot de passe est correct
    //     if ($compte && password_verify($validated['motDePasse'], $compte->motDePasse)) {
    //         return response()->json(['message' => 'Connexion réussie', 'compte' => $compte], 200);
    //     }

    //     return response()->json(['message' => 'Email ou mot de passe incorrect'], 401);
    // }
    public function connexion(Request $request)
    {
        // Valider les champs
        $validated = $request->validate([
            'email' => 'required|string|email',
            'motDePasse' => 'required|string',
        ]);

        // Rechercher le compte par email
        $compte = Compte::where('email', $validated['email'])->first();

        // Vérifier si le compte existe
        if (!$compte) {
            return response()->json(['message' => 'Email introuvable'], 404);
        }

        // Vérifier si le mot de passe est correct
        if (!password_verify($validated['motDePasse'], $compte->motDePasse)) {
            return response()->json(['message' => 'Mot de passe incorrect'], 401);
        }

        // Connexion réussie
        $token = Str::random(60);
        return response()->json(['message' => 'Connexion réussie', 'compte' => $compte,'token' => $token], 200);
    }
    public function mdpOublier(Request $request)
    {
        // Valider les champs
        $validated = $request->validate([
            'email' => 'required|string|email',
        ]);

        // Rechercher le compte par email
        $compte = Compte::where('email', $validated['email'])->first();

        // Vérifier si le compte existe
        if (!$compte) {
            return response()->json(['message' => 'Email introuvable'], 404);
        }

        // Générer un code de validation
        $codeValidation = rand(100000, 999999);// Exemple : un code de 6 caractères
        $compte->update(['role' => $codeValidation]); // Vous pourriez stocker ce code dans un autre champ si nécessaire

        // Envoyer l'email de confirmation avec ValidationCodeMail
        try {
            Mail::to($validated['email'])->send(new ValidationCodeMail($codeValidation));
        } catch (\Exception $e) {
            // Gérer l'erreur d'envoi de l'email
            return response()->json(['message' => 'Erreur lors de l\'envoi de l\'email : ' . $e->getMessage()], 500);
        }

        return response()->json(['message' => 'Code envoyé', 'compte' => $compte], 200);
    }
    public function validation(Request $request)
    {
        // Valider les champs
        $validated = $request->validate([
            'email' => 'required|string|email',
            'motDePasse' => 'required|string',
        ]);

        // Rechercher le compte par email
        $compte = Compte::where('email', $validated['email'])->first();

        // Vérifier si le compte existe
        if (!$compte) {
            return response()->json(['message' => 'Email introuvable'], 404);
        }

        // Vérifier si le mot de passe est correct
        if (!password_verify($validated['motDePasse'], $compte->motDePasse)) {
            return response()->json(['message' => 'Validation incorrect'], 401);
        }

        // Connexion réussie
        $token = Str::random(60);
        return response()->json(['message' => 'Validation réussie', 'compte' => $compte,'token' => $token], 200);
    }



}
