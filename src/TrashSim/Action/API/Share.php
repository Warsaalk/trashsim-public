<?php
namespace TrashSim\Action\API;

use Plinth\Common\Message;
use Plinth\Request\ActionType;
use Plinth\Validation\Property\ValidationVariable;
use Plinth\Validation\Validator;
use Predis\Client;
use Ramsey\Uuid\Uuid;

class Share extends ActionType
{
	/**
	 * @param array $validations
	 */
	public function setValidations(array &$validations)
	{
		$version = new ValidationVariable("version");
		$version->setType(Validator::PARAM_INTEGER);
		$version->setRules([Validator::RULE_MIN_INTEGER => 2]);
		$version->setMessage(new Message("TRASHSIM ERROR - Invalid share version!", Message::TYPE_ERROR));

		$validations[] = $version;
	}

	/**
	 * @param array $variables
	 * @param array $files
	 * @param array $validations
	 * @return array
	 */
	public function onFinish(array $variables, array $files, array $validations)
	{
		try {
			$UUID = Uuid::uuid4();

			$data = json_encode($this->main->getRequest()->getRawData());

			if (strlen($data) <= 8192) {
				//Split main combat key
				$redisKey = "trashsim-share-$UUID";

				$client = new Client($redisKey);
				$client->set($redisKey, $data);
				$client->expire($redisKey, 60 * 60 * 24 * 3); //The key expires after 3 day

				return ["id" => $UUID];
			} else {
				$this->addError(new Message($this->Main()->getDict()->get('error.share.length'), Message::TYPE_ERROR));
			}
		} catch (\Exception $e) {

		}

		return [];
	}

	/**
	 * @param array $validations
	 * @return array|void
	 */
	public function onError(array $validations) {}
}