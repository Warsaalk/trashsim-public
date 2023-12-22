#!/bin/sh

DOMAIN="trashsim.universeview.be"

if [ $1 = "preview" ]; then
    DOMAIN="preview.trashsim.universeview.be"
fi

echo "Update: start"

#Activate update
touch public/updating

#Clear cache so people will see the update page right away
#sudo varnishadm "ban req.http.host ~ trashsim.universeview.be"

echo "Update: clear cache for $DOMAIN"

sh nginx-cache-clear.sh $DOMAIN /home/war/www/nginx-cache