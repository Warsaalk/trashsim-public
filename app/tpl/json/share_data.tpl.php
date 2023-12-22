<?php
/* @var $this \Plinth\Response\Response */

if (isset($data)) {
	print json_encode(["shareData" => $data]);
} else {
	print json_encode(["errors" => $this->Main()->getMessages()]);
}