#!/bin/sh

PATH="/www/trashsim/"

if [ $1 = "preview" ]; then
    PATH="/www/trashsim-preview/"
fi

echo "Update: sync assets to CDN path $PATH"

/usr/bin/rsync -vae "/usr/bin/ssh -i /home/war/www/cdn77/id_rsa -o StrictHostKeyChecking=no" public/assets/ user_y2l269m6@push-12.cdn77.com:$PATH