#!/bin/sh

DOMAIN="trashsim.universeview.be"

if [ $1 = "preview" ]; then
    DOMAIN="preview.trashsim.universeview.be"
fi

echo "Update: running post deployment scripts"

#Create log directory
if [ ! -d app/log ]; then
        mkdir -m 0775 app/log
fi

#Handle composer
alias comp='/usr/bin/php composer.phar'

if [ ! -f composer.phar ]; then
        curl https://getcomposer.org/installer -o composer.phar
fi

comp selfupdate
comp update

#Create node_modules directory
if [ ! -d app/assets/node_modules ]; then
        npm install --prefix app/assets/
fi

if ! type grunt > /dev/null; then
        npm install -g grunt-cli
fi

#clean assets directory
rm -rf public/assets/*

#build new assets
grunt --base app/assets --gruntfile app/assets/Gruntfile.js

#Deactivate update
rm -f public/updating

#Clear cache so people will see the index page right away
#sudo varnishadm "ban req.http.host ~ trashsim.universeview.be"

echo "Update: clear cache for $DOMAIN"

sh nginx-cache-clear.sh $DOMAIN /home/war/www/nginx-cache
