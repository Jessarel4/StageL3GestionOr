<?php

namespace App\Http\Controllers;

use App\Models\Agence;
use Illuminate\Http\Request;

class AgenceController extends Controller
{
    //
    public function listeAgence(){
        $agence = Agence::all();

        $data = $agence->map(function  ($agence){
            return [
                'value' => $agence->id,
                'label' => $agence->nomResponsable,
            ];
        });
        return response()->json($data);
    }
}
