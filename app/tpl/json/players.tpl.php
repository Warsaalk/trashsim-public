<?php
use Plinth\Response\Response;
/* @var $self Response */

$request = $self->Main()->getRequest();
$validator = $self->Main()->getValidator();

if ($validator->isValid() && !$request->hasErrors() && isset($responseData)) {

	header(Response::CODE_201);
	
	print json_encode($responseData);

} else {

	print $self->getTemplate('json/info');

}