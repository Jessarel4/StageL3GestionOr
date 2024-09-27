<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Province
 * 
 * @property int $id
 * @property string $nomProvince
 * 
 * @property Collection|Region[] $regions
 *
 * @package App\Models
 */
class Province extends Model
{
	protected $table = 'province';
	public $timestamps = false;

	protected $fillable = [
		'nomProvince'
	];

	public function regions()
	{
		return $this->hasMany(Region::class, 'provinceId');
	}
}
