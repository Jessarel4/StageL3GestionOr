<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Administrateur
 * 
 * @property int $id
 * @property string $nomResponsable
 * @property string $adresseResponsable
 * @property string $cinResponsable
 * @property string $contactResponsable
 * @property int|null $compteId
 * 
 * @property Compte|null $compte
 *
 * @package App\Models
 */
class Administrateur extends Model
{
	protected $table = 'administrateur';
	public $timestamps = false;

	protected $casts = [
		'compteId' => 'int'
	];

	protected $fillable = [
		'nomResponsable',
		'adresseResponsable',
		'cinResponsable',
		'contactResponsable',
		'compteId'
	];

	public function compte()
	{
		return $this->belongsTo(Compte::class, 'compteId');
	}
}
