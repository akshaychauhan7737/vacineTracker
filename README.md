# vacineTracker


```

server {
  listen       80;
  root /var/www/html;
  server_name  localhost;

  index index.php index.html index.htm index.nginx-debian.html;
#  root /var/www/html

  location ~ \.php$ {
    include snippets/fastcgi-php.conf;
    #fastcgi_pass 127.0.0.1:9000;
     fastcgi_pass unix:/run/php/php8.0-fpm.sock;
  }

  location / {
    proxy_pass http://localhost:8090;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}

```
