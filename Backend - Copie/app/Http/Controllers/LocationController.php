<?php

namespace App\Http\Controllers;

use App\Models\Province;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function index()
    {
        $provinces = Province::whereHas('regions.districts.communes')->with(['regions' => function ($query) {
            $query->whereHas('districts.communes');
        }, 'regions.districts' => function ($query) {
            $query->whereHas('communes');
        }])->get();

        $formattedData = $provinces->map(function ($province) {
            return [
                'value' => $province->id,
                'label' => $province->nomProvince,
                'children' => $province->regions->map(function ($region) {
                    return [
                        'value' => $region->id,
                        'label' => $region->nomRegion,
                        'children' => $region->districts->map(function ($district) {
                            return [
                                'value' => $district->id,
                                'label' => $district->nomDistrict,
                                'children' => $district->communes->map(function ($commune) {
                                    return [
                                        'value' => $commune->id,
                                        'label' => $commune->nomCommune,
                                    ];
                                }),
                            ];
                        }),
                    ];
                }),
            ];
        });

        return response()->json($formattedData);
    }

    
}
