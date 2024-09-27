<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Compte
 * 
 * @property int $id
 * @property string $utilisateur
 * @property string $email
 * @property string $motDePasse
 * @property string $photo
 * @property string $role
 * 
 * @property Collection|Administrateur[] $administrateurs
 * @property Collection|Agence[] $agences
 * @property Collection|Anor[] $anors
 * @property Collection|Comptoir[] $comptoirs
 *
 * @package App\Models
 */
class Compte extends Model
{
	protected $table = 'compte';
	public $timestamps = false;

	protected $fillable = [
		'utilisateur',
		'email',
		'motDePasse',
		'photo',
		'role'
	];

	public function administrateurs()
	{
		return $this->hasMany(Administrateur::class, 'compteId');
	}

	public function agences()
	{
		return $this->hasMany(Agence::class, 'compteId');
	}

	public function anors()
	{
		return $this->hasMany(Anor::class, 'compteId');
	}

	public function comptoirs()
	{
		return $this->hasMany(Comptoir::class, 'compteId');
	}
}
