<?php
namespace TrashSim\Action;

use Plinth\Request\ActionTypeLogin;
use Plinth\Validation\Property\ValidationVariable;
use Plinth\Validation\Validator;
use Plinth\Common\Message;

class Login extends ActionTypeLogin
{
	/**
	 * @return array
	 */
	public function getSettings()
	{
		return [
			'token' => [
			    'required' => true,
			    'message' => new Message('Je login token is verlopen, gelieve opnieuw te proberen.', Message::TYPE_ERROR)
			]
		];
	}

	public function setValidations(array &$validations)
	{
		$login = new ValidationVariable("email");
		$login->setRules([Validator::RULE_MIN_LENGTH => 2]);
		$login->setMessage(new Message("test login"));

		$validations[] = $login;

		$password = new ValidationVariable("password");
		$password->setType(Validator::PARAM_PASSWORD);
		$password->setRules([Validator::RULE_MIN_LENGTH => 2]);
		$password->setMessage(new Message("test password"));

		$validations[] = $password;
	}

	public function getLoginLabel()
	{
		return "email";
	}

	public function getTokenLabel()
	{
		return "password";
	}

	/**
	 * @param array $variables
	 * @param array $files
	 * @param array $validations
	 * @return array|void
	 * @throws \Plinth\Exception\PlinthException
	 */
	public function onFinish(array $variables, array $files, array $validations)
	{
		if ($this->main->getUserService()->login($variables['email'], $variables['password'])) {
        	$this->main->addMessage(new Message('Succesvol ingelogd', Message::TYPE_SUCCESS));
        } else {
        	$this->main->addMessage(new Message('Login mislukt', Message::TYPE_ERROR));
   		}
	}

	/**
	 * @param array $validations
	 * @return array|void
	 */
	public function onError(array $validations)
	{
		$this->main->addMessage(new Message('Login mislukt', Message::TYPE_ERROR));
	}

	public function onLoginSuccess(array $variables, array $validations)
	{

	}

	public function onLoginFailed(array $variables, array $validations)
	{

	}
}