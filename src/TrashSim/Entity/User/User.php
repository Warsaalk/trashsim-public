<?php

namespace TrashSim\Entity\User;

use Plinth\User\User as PlinthUser;

class User extends PlinthUser {

	/**
	 * @var integer
	 */
	private $ID;

	/**
	 * @var string
	 */
	private $login;

	/**
	 * @var string
	 */
	private $password;

	/**
	 * User constructor.
	 * @param $login
	 * @param $password
	 * @param $session
	 */
	public function __construct($login, $password) {

		$this->ID = microtime(true);
		$this->login = $login;
		$this->password = $password;

	}
	
	/* (non-PHPdoc)
	 * @see \Plinth\User\User::getID()
	 */
	public function getID() {

		return $this->ID;

	}
	
	
	/* (non-PHPdoc)
	 * @see \Plinth\User\User::getLogin()
	 */
	public function getLogin() {
		
		return $this->login;

	}

	
	/* (non-PHPdoc)
	 * @see \Plinth\User\User::getToken()
	 */
	public function getToken() {
		
		return $this->password;

	}

	/* (non-PHPdoc)
	 * @see \Plinth\User\User::clearToken()
	 */
	public function clearToken() {

		$this->password = NULL;
		unset($this->password);

	}

}