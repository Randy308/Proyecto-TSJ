FROM php:8.3-fpm

# Argumentos para UID/GID dinámicos
ARG UID=1000
ARG GID=1000

# Instala dependencias del sistema
RUN apt-get update && apt-get install -y \
    build-essential libpng-dev libjpeg-dev libonig-dev libxml2-dev \
    zip unzip git curl supervisor libpq-dev libzip-dev \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql mbstring exif pcntl bcmath gd zip

RUN groupmod -g ${GID} www-data && \
    usermod -u ${UID} -g www-data www-data

# Cambiar shell de www-data a /bin/sh
RUN chsh -s /bin/sh www-data || true
# Instala extensiones de PHP    
COPY ./docker/php/custom-php.ini /usr/local/etc/php/conf.d/custom-php.ini


# Instala Composer
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www
COPY . .

# Copia configuración de supervisord
COPY ./docker/supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copia el entrypoint
COPY ./entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 9000
ENTRYPOINT ["sh", "/usr/local/bin/entrypoint.sh"]
CMD ["supervisord", "-n"]