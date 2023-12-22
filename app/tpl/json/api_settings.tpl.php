<?php
use Plinth\Response\Response;
/* @var $self Response */

$config = $self->Main()->config;

echo json_encode(array(
	"locales" => $config->get('language:locales'),
	"default_locale" => $config->get('settings:defaultlocale'),
	"version" => $config->get('assets:version'),
	"timezone" => $config->get('date:timezone')
));