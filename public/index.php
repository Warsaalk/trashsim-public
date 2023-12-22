<?php

use Plinth\Main;
use Plinth\Dictionary;

require_once '../const.php'; //File which contains all constant info & includes
require_once __VENDOR . 'autoload.php';

/* @var Main $main */
$main = new Main(false); //Create Main 

$main->handleRequest();
$main->getDict()->loadFile('javascript', Dictionary::TYPE_PHP, true);
$main->getDict()->loadFile('languages', Dictionary::TYPE_PHP, true);

echo $main->getResponse()->render();