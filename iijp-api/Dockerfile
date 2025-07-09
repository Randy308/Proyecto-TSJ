# Usa una imagen oficial de PHP con extensiones necesarias
FROM php:8.3-fpm

# Instala dependencias del sistema
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libjpeg-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    curl \
    supervisor \
    libpq-dev \
    libzip-dev \
    && docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd zip

# Instala Composer
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

# Establece directorio de trabajo
WORKDIR /var/www

# Copia los archivos del proyecto
COPY . .

# Instala dependencias de PHP
RUN composer install --no-interaction --prefer-dist --optimize-autoloader


# Establece permisos para Laravel
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache /var/www

# Copia configuración de supervisor
COPY ./docker/supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expone el puerto por defecto de PHP-FPM
EXPOSE 9000

# Comando por defecto al iniciar el contenedor
CMD ["supervisord", "-n"]
