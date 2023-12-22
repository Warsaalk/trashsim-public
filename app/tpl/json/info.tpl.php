<?php
use Lib\Model\Response\Response;
/* @var $self Response */

$json = array('errors' => array());
foreach ($self->Main()->getInfo() as $i => $info) {
    $json['errors'][] = $info->getArray();
}
print json_encode($json);