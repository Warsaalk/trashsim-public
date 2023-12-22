<?php
use Plinth\Request\ActionType;
use Plinth\Common\Debug;
use Plinth\Validation\Validator;
use Plinth\Main;
use Plinth\Common\Info;
use Predis\Client;
use Rhumsaa\Uuid\Uuid;
use OGotcha\Generator\BBCode_Parser;
use OGetIt\Exception\ApiException;
use OGetIt\Exception\CurlException;
use OGetIt\OGetIt;
use OGotcha\Generator\Generator;

class PlayersPost extends ActionType {
	
	/**
	 * (non-PHPdoc)
	 * @see \Plinth\Request\ActionType::getSettings()
	 */
	public function getSettings() {
		
		return array(
			'variables' => array(
				'defender' => array(
					'type' => Validator::PARAM_STRING,
					'rules' => array(
						Validator::RULE_REGEX => '/^sr-[a-z]{2}-\d{1,3}-\w{40}$/'
					),
					'message' => new Info('Please paste a correct SR-key!', Info::ERROR),
					'preCallback' => function ($text) {
						return trim($text);
					}
				),
				'attackers' => array(
					'type' => Validator::PARAM_MULTIPLE_STRING,
					'rules' => array(
						Validator::RULE_REGEX => '/^sr-[a-z]{2}-\d{1,3}-\w{40}$/'
					),
					'required' => false,
					'message' => new Info('Please paste a correct SR-key!', Info::ERROR),
					'preCallback' => function ($text) {
						return trim($text);
					}
				),
				'defenders' => array(
					'type' => Validator::PARAM_MULTIPLE_STRING,
					'rules' => array(
						Validator::RULE_REGEX => '/^sr-[a-z]{2}-\d{1,3}-\w{40}$/'
					),
					'required' => false,
					'message' => new Info('Please paste a correct SR-key!', Info::ERROR),
					'preCallback' => function ($text) {
						return trim($text);
					}
				)
			)
		);
		
	}
	
	/**
	 * @param OGetIt $ogetit
	 * @param array $codes
	 * @param string $user
	 * @param string $pass
	 */
	private function loadPartyReports($ogetit, $codes, $user = false, $pass = false) {
		
		$members = array();
				
		if ($codes) {
			foreach ($codes as $code) {
				if (strlen($code) > 0) {
					$key = explode('-', $code);
					//Check if community & universe match with the main combat key
					if ($key[1] === $ogetit->getCommunity() && $key[2] === $ogetit->getUniverseID()) {
						$members[] = $ogetit->getSpyReport($key[3], $user, $pass)->getDefender();
					}
				}
			}
		}
		
		return $members;
		
	}
	
	/**
	 * (non-PHPdoc)
	 * @see \Plinth\Request\ActionType::onFinish()
	 */
	public function onFinish(array $variables, array $files) {
		
		$start = microtime(true); //Timer to measure execution
				
		//Split main combat key 
		$crdata = explode('-', $variables['defender']);
		$lang	= $crdata[1];
		$uni	= $crdata[2];
		$srkey	= $crdata[3];
		
		//This user / pass definition is used for Origin universe 680 (testing purpose)
		$user = false;
		$pass = false;
		if ($lang === 'en' && $uni === '680') {

		}
		
		//Define OGetIt to do all the report processing 
		$ogetit = new OGetIt($uni, $lang, $this->Main()->config->get('ogame:api'));
		$ogetit->useHttps();
		
		try {

			$defender = $ogetit->getSpyReport($srkey, $user, $pass)->getDefender();
			$defenders = $this->loadPartyReports($ogetit, $variables['defenders'], $user, $pass);
			$attackers = $this->loadPartyReports($ogetit, $variables['attackers'], $user, $pass);
			
			//Set elapsed execution time
			$time_elapsed_secs = microtime(true) - $start;
			
			//Set template data
			$responseData = array(
				'data' => array(
					'defender' => $defender,
					'defenders' => $defenders,
					'attackers' => $attackers
				),
				'time' => $time_elapsed_secs
			);
			$response = $this->Main()->getResponse();
			$response->addData('responseData', $responseData);		
			
		} catch (ApiException $e) {
			if ($e->getCode() === ApiException::INVALID_CR_ID) {
				$this->Main()->addInfo(new Info($this->Main()->getDict()->get('error.api.6000'), Info::ERROR));
			} else {
				$this->Main()->addInfo(new Info($this->Main()->getDict()->get('error.convert', $e->getCode()), Info::ERROR));
			}
		} catch (CurlException $e) {
			$this->Main()->addInfo(new Info($this->Main()->getDict()->get('error.convert', $e->getCode()), Info::ERROR));
		}
		
	}
	
	/**
	 * (non-PHPdoc)
	 * @see \Plinth\Request\ActionType::onError()
	 */
	public function onError() {}
	
}