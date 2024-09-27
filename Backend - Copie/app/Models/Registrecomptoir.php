<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Registrecomptoir
 * 
 * @property int $id
 * @property Carbon $date
 * @property int $quantite
 * @property int $prix
 * @property int|null $paysId
 * @property int|null $comptoirId
 * @property int|null $anorId
 * 
 * @property Anor|null $anor
 * @property Comptoir|null $comptoir
 * @property Pay|null $pay
 *
 * @package App\Models
 */
class Registrecomptoir extends Model
{
	protected $table = 'registrecomptoir';
	public $timestamps = false;

	protected $casts = [
		'date' => 'datetime',
		'quantite' => 'int',
		'prix' => 'int',
		'paysId' => 'int',
		'comptoirId' => 'int',
		'anorId' => 'int'
	];

	protected $fillable = [
		'date',
		'quantite',
		'prix',
		'paysId',
		'comptoirId',
		'anorId'
	];

	public function anor()
	{
		return $this->belongsTo(Anor::class, 'anorId');
	}

	public function comptoir()
	{
		return $this->belongsTo(Comptoir::class, 'comptoirId');
	}

	public function pay()
	{
		return $this->belongsTo(Pay::class, 'paysId');
	}
}
