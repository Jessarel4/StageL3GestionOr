<?php

namespace App\Http\Controllers;

use App\Models\Compte;
use Illuminate\Http\Request;

class WelcomController extends Controller
{
    //
    public function welcomconsol(){
        $data = Compte::all();
        return response()->json($data);
    }

    public function ajouter_compte()
    {

        try {
            //code...
            $compte = new Compte();
            $compte->utilisateur = "Jahaziela";
            $compte->email = "jaz@gmail.com";
            $compte->motDePasse = "123456";
            $compte->photo = "/okok";
            $compte->role = "dodo";
            $compte->save();
            return redirect('/welcom');
        } catch (\Throwable $th) {
            //throw $th;
        }
        // $request->validate([
        //     'utilisateur' => 'required',
        //     'email' => 'required',
        //     'motDePasse' => 'required',
        //     'photo' => 'required',
        //     'role' => 'required',
        // ]);

        // $compte = new Compte();
        // $compte->utilisateur = $request->utilisateur;
        // $compte->email = $request->email;
        // $compte->motDePasse = $request->motDePasse;
        // $compte->photo = $request->photo;
        // $compte->role = $request->role;
        // $compte->save();


    }
    public function modifie_compte()
    {

        try {
            //code...
            $compte = Compte::find(6);
            $compte->utilisateur = "Jahaziela";
            $compte->email = "jamodifz@gmail.com";
            $compte->motDePasse = "123456";
            $compte->photo = "/okok";
            $compte->role = "dodo";
            $compte->save();
            return redirect('/welcom');
        } catch (\Throwable $th) {
            //throw $th;
        }
        // $request->validate([
        //     'utilisateur' => 'required',
        //     'email' => 'required',
        //     'motDePasse' => 'required',
        //     'photo' => 'required',
        //     'role' => 'required',
        // ]);

        // $compte = new Compte();
        // $compte->utilisateur = $request->utilisateur;
        // $compte->email = $request->email;
        // $compte->motDePasse = $request->motDePasse;
        // $compte->photo = $request->photo;
        // $compte->role = $request->role;
        // $compte->save();


    }
    public function supression_compte()
    {

        try {
            //code...
            $compte = Compte::find(6);
            $compte->delete();
            return redirect('/welcom');
        } catch (\Throwable $th) {
            //throw $th;
        }

    }
}
