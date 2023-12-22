# TrashSim - OGame simulator

This is an orphan copy of the original code of TrashSim in its latest version, created by Klaas.
The repository does not contain commit history because there are older commits that contain sensitive information.

__IMPORTANT NOTE: The code in this repository will also not be updated in any way, it will remain in this fixed state.__

It is published only so that others can continue my work. 

## Where to look
The main question most will ask is, where is the simulation code.
You can find the worker code under: `src/Resources/js/workers/simulator/`.

* App config: `app/config/`
* HTML Templates: `app/tpl/`
  * Route info: `app/config/routing(_*).json`
* Translations: `app/locale/`
* Form actions: `app/action/` & `src/TrashSim/Action/`
  * Entities: `src/TrashSim/Entity/`
* Front-end assets: `src/Resources/`
  
## Requirements
This web application needs PHP 7+ and can be installed with composer.
Your domain must point to the `public/`, which is the main entry point for users.

TrashSim is build using a custom PHP framework called Plinth for the PHP back-end.

To compile the front-end assets, go to the `src/Resources` directory and run `npm install` the first time.
Then run `grunt` or `grunt production` to compile the front-end code and move it to the public folder.

The front-end was written in the older version of Angular, AngularJS.

The application can run using Apache (httpd) or Nginx (php-fpm).
URLs are rewritten, this requires some extra configuration, which you can find below.

### Environment file
Create an environment file in the root directory named `env.ini`.
The environment file is used by the application to load the necessary secrets and dynamic configuration.

```
[settings]  
assetpath = `assets/` or `https://cdn.[yourdomain]` 

[ogotcha]  
api = `https://ogotcha.[yourdomain]/api/`

[ogame]  
key = `OGame API key`

[matomo]  
api = `Matomo hit URL`

[admin]  
user = `A simple username`  
pass = `Password encrypted using password_hash();`
```

### Rewriting URLs

#### Apache / HTTPD

Add the following rewrite configuration to your virtual host configuration.

```
# Rewriting for Plinth
<IfModule mod_rewrite.c>
    #LogLevel alert rewrite:trace8

    RewriteEngine On

    RewriteCond %{REQUEST_URI}::$1 ^(/.+)/(.*)::\2$
    RewriteRule ^(.*) - [E=APP_BASE:%1]

    RewriteCond %{ENV:REDIRECT_STATUS} ^$
    RewriteRule ^index\.php(/(.*)|$) %{ENV:APP_BASE}/$2 [R=301,L]

    RewriteCond %{DOCUMENT_ROOT}%{ENV:APP_BASE}%{REQUEST_FILENAME} -f
    RewriteRule .? - [L]

    RewriteCond %{DOCUMENT_ROOT}%{ENV:APP_BASE}/updating -f
    RewriteRule (.*) %{ENV:APP_BASE}/update.html [L]

    RewriteRule (.*) %{ENV:APP_BASE}/index.php/$1 [L]
</IfModule>
```

### Nginx

Coming

```

```