<?php
/**
 * Application constants
 */
//Main paths
define( '__BASE'			, (isset($_SERVER['APP_BASE']) && $_SERVER['APP_BASE'] !== NULL ? $_SERVER['APP_BASE'] : "") . '/'		);
define( '__BASE_SCHEME'		, !empty($_SERVER['HTTPS']) && stristr($_SERVER['HTTPS'], 'off') === false ? 'https:' : 'http:' );
define( '__BASE_URL'		, '//'.$_SERVER['HTTP_HOST'].__BASE 	);
define( '__BASE_ROOT'		, __DIR__ . DIRECTORY_SEPARATOR			);
define( '__APP_URL'			, 'https:' . __BASE_URL 			);

//Application files
define( '__APP_PATH'        , __BASE_ROOT 	. 'app' 	. DIRECTORY_SEPARATOR );
define( '__DICTIONARY' 		, __APP_PATH 	. 'locale' 	. DIRECTORY_SEPARATOR );
define( '__APP_CONFIG_PATH'	, __APP_PATH 	. 'config' 	. DIRECTORY_SEPARATOR );

//Config files
define( '__APP_CONFIG_PROD'			, __APP_CONFIG_PATH . 'config.ini'		);
define( '__APP_CONFIG_ROUTING'		, __APP_CONFIG_PATH . 'routing.json'	);
define( '__APP_CONFIG_COMPONENTS'	, __APP_CONFIG_PATH . 'components.json'	);

//Logging
define( '__LOGGING_PATH'   , __APP_PATH . 'log'. DIRECTORY_SEPARATOR );

//Templates
define( '__TEMPLATE' 		, __APP_PATH . 'tpl' . DIRECTORY_SEPARATOR );

//Extensions
define( '__EXTENSION_PHP'		, '.php' );
define( '__EXTENSION_JSON'		, '.json' );
define( '__EXTENSION_TEMPLATE'	, '.tpl' . __EXTENSION_PHP );
define( '__EXTENSION_DICT_PHP'	, '.locale'. __EXTENSION_PHP );
define( '__EXTENSION_DICT_JSON'	, '.locale'. __EXTENSION_JSON);

//Modules & Third party software
define( '__SRC'				, __BASE_ROOT . 'src' . DIRECTORY_SEPARATOR	);
define( '__VENDOR'			, __BASE_ROOT . 'vendor' . DIRECTORY_SEPARATOR	);

//Namespaces
define( '__APP_ACTION'	, __APP_PATH . 'action' . DIRECTORY_SEPARATOR );

define( '__PUBLIC', __BASE_ROOT . 'public' . DIRECTORY_SEPARATOR);

/**
 * Autoloading for App directory
 */
set_include_path(get_include_path() . PATH_SEPARATOR . __APP_PATH);

spl_autoload_extensions(__EXTENSION_PHP);
spl_autoload_register();