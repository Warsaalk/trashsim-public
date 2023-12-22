<?php
namespace TrashSim\Controller\API;

use Plinth\Routing\Route;
use Predis\Client;

class Share extends \Plinth\Controller\Controller
{
	/**
	 * @param Route $route
	 * @return array
	 */
	public function getData (Route $route)
	{
		$UUID = $route->get("uuid");

		//Split main combat key
		$redisKey = "trashsim-share-$UUID";

		$client = new Client($redisKey);
		if ($client->exists($redisKey)) {
			return [["data" => json_decode($client->get($redisKey), true)]];
		} else {
			// TODO handle error messages
		}

		return [[]];
	}
}