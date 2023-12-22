<?php
/** @var $this \Plinth\Response\Response */

$localeFile = __TEMPLATE .
	"admin" . DIRECTORY_SEPARATOR .
	"translations" . DIRECTORY_SEPARATOR .
	$this->main->getRouter()->getRoute()->get("locale") . ".json";

if (file_exists($localeFile)) {
	print file_get_contents($localeFile);
} else {
	header(\Plinth\Response\Response::CODE_404);
}