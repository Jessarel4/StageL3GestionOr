<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Commune
 * 
 * @property int $id
 * @property string $nomCommune
 * @property int|null $districtId
 * 
 * @property District|null $district
 * @property Collection|Agence[] $agences
 * @property Collection|Collecteur[] $collecteurs
 * @property Collection|Orpailleur[] $orpailleurs
 *
 * @package App\Models
 */
class Commune extends Model
{
	protected $table = 'commune';
	public $timestamps = false;

	protected $casts = [
		'districtId' => 'int'
	];

	protected $fillable = [
		'nomCommune',
		'districtId'
	];

	public function district()
	{
		return $this->belongsTo(District::class, 'districtId');
	}

	public function agences()
	{
		return $this->hasMany(Agence::class, 'communeId');
	}

	public function collecteurs()
	{
		return $this->hasMany(Collecteur::class, 'communeId');
	}

	public function orpailleurs()
	{
		return $this->hasMany(Orpailleur::class, 'communeId');
	}
}
