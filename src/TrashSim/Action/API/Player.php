<?php
namespace TrashSim\Action\API;

use Plinth\Common\Message;
use Plinth\Request\ActionType;
use Plinth\Validation\Property\ValidationVariable;
use Plinth\Validation\Validator;
use Predis\Client;
use OGetIt\Exception\ApiException;
use OGetIt\Exception\CurlException;
use OGetIt\OGetIt;

class Player extends ActionType
{
	/**
	 * @param array $validations
	 */
	public function setValidations(array &$validations)
	{
		$key = new ValidationVariable("key");
		$key->setRules([Validator::RULE_REGEX => "/^sr-[a-z]{2}-\d{1,3}-\w{40}$/"]);
		$key->setMessage(new Message("TRASHSIM ERROR - Invalid SR-key!", Message::TYPE_ERROR));
		$key->setPostCallback(function ($key) {
			return trim($key);
		});

		$validations[] = $key;

		$party = new ValidationVariable("party");
		$party->setType(Validator::PARAM_STRING);
		$party->setRules([Validator::RULE_REGEX => "/^(attackers|defenders)$/"]);
		$party->setMessage(new Message("TRASHSIM ERROR - Invalid party label!", Message::TYPE_ERROR));

		$validations[] = $party;

		$fleet = new ValidationVariable("fleet");
		$fleet->setType(Validator::PARAM_INTEGER);
		$fleet->setRules([Validator::RULE_MIN_INTEGER => 0]);
		$fleet->setMessage(new Message("TRASHSIM ERROR - Invalid fleet index!", Message::TYPE_ERROR));

		$validations[] = $fleet;
	}

	/**
	 * @param $key
	 * @return array
	 */
	private function parseApiKey ($key)
	{
		$data = explode('-', $key);

		if ($data[1] == 'yu') $data[1] = 'ba';

		return $data;
	}

	/**
	 * @param array $variables
	 * @param array $files
	 * @param array $validations
	 * @return array
	 */
	public function onFinish(array $variables, array $files, array $validations)
	{
		$start = microtime(true); //Timer to measure execution
				
		//Split main combat key 
		$crdata = $this->parseApiKey($variables['key']);
		$lang	= $crdata[1];
		$uni	= $crdata[2];
		$srkey	= $crdata[3];
		
		//This user / pass definition is used for Origin universe 680 (testing purpose)
		$user = $pass = false;

		//Define OGetIt to do all the report processing 
		$ogetit = new OGetIt($uni, $lang, $this->Main()->config->get('ogame:api'));
		$ogetit->useHttps();

		try {
			$data = $ogetit->getSpyReport($srkey, $user, $pass);

			$redisKey = "trashsim-server-$lang-$uni";
			$client = new Client($redisKey);

			if ($client->exists($redisKey)) {
				$serverdata = $client->get($redisKey);
			} else {
				try {
					$serverdata = $ogetit->getServerData($user, $pass);
					$serverdata = $serverdata !== false ? json_encode($serverdata) : false;
				} catch (\Exception $e) {
					$serverdata = false;
				}
				
				if ($serverdata !== false) {
					$client->set($redisKey, $serverdata);
					$client->expire($redisKey, 60 * 60 * 24); //The key expires after 1 day
				}
			}

			//Set elapsed execution time
			$time_elapsed_secs = microtime(true) - $start;
			
			//Set template data
			$playerData = array(
				'data' => $data,
				'party' => $variables['party'],
				'fleet' => $variables['fleet'],
				'time' => $time_elapsed_secs
			);
			
			if ($serverdata !== false) $playerData['server'] = json_decode($serverdata);
			
			return ["playerData" => $playerData];
		} catch (ApiException $e) {
			if ($e->getCode() === ApiException::INVALID_CR_ID) {
				$this->Main()->addMessage(new Message($this->Main()->getDict()->get('error.api.6000'), Message::TYPE_ERROR));
			} else {
				$this->Main()->addMessage(new Message($this->Main()->getDict()->get('error.convert', $e->getCode()), Message::TYPE_ERROR));
			}
		} catch (CurlException $e) {
			$this->Main()->addMessage(new Message($this->Main()->getDict()->get('error.convert', $e->getCode()), Message::TYPE_ERROR));
		}

		return [];
	}

	/**
	 * @param array $validations
	 * @return array|void
	 */
	public function onError(array $validations) {}
}