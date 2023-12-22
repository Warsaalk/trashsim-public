<?php

namespace TrashSim\Entity\User;

use Plinth\User\UserRepository as PlinthUserRepository;

class UserRepository extends PlinthUserRepository
{
	/* (non-PHPdoc)
	 * @see \Plinth\User\UserRepository::find()
	 */
	public function find($ID)
	{
		return $this->getUser();
	}

	/* (non-PHPdoc)
	 * @see \Plinth\User\UserRepository::findUserWithLogin()
	 */
	public function findUserWithLogin($login)
	{
        $allowedUser = $this->main->config->get("admin:user");

		if ($login == $allowedUser) return $this->getUser();
		
		return false;
	}

	/**
	 * @return User
	 */
	private function getUser()
    {
        $allowedUser = $this->main->config->get("admin:user");

		return new User($allowedUser, $this->main->config->get("admin:pass"));
	}
}