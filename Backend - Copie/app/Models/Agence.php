<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Agence
 * 
 * @property int $id
 * @property string $nomResponsable
 * @property string $adresseResponsable
 * @property string $cinResponsable
 * @property string $contactResponsable
 * @property int|null $communeId
 * @property int|null $compteId
 * 
 * @property Commune|null $commune
 * @property Compte|null $compte
 * @property Collection|Registrecollecteur[] $registrecollecteurs
 * @property Collection|Registreorpailleur[] $registreorpailleurs
 *
 * @package App\Models
 */
class Agence extends Model
{
	protected $table = 'agence';
	public $timestamps = false;

	protected $casts = [
		'communeId' => 'int',
		'compteId' => 'int'
	];

	protected $fillable = [
		'nomResponsable',
		'adresseResponsable',
		'cinResponsable',
		'contactResponsable',
		'communeId',
		'compteId'
	];

	public function commune()
	{
		return $this->belongsTo(Commune::class, 'communeId');
	}

	public function compte()
	{
		return $this->belongsTo(Compte::class, 'compteId');
	}

	public function registrecollecteurs()
	{
		return $this->hasMany(Registrecollecteur::class, 'agenceId');
	}

	public function registreorpailleurs()
	{
		return $this->hasMany(Registreorpailleur::class, 'agenceId');
	}
}
