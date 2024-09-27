<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Pay
 * 
 * @property int $id
 * @property string $nomPays
 * 
 * @property Collection|Registrecomptoir[] $registrecomptoirs
 *
 * @package App\Models
 */
class Pay extends Model
{
	protected $table = 'pays';
	public $timestamps = false;

	protected $fillable = [
		'nomPays'
	];

	public function registrecomptoirs()
	{
		return $this->hasMany(Registrecomptoir::class, 'paysId');
	}
}
