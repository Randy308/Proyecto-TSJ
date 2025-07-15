#!/bin/sh

set -e

echo "🔧 Estableciendo permisos..."
chown -R www-data:www-data /var/www
chmod -R 775 /var/www/storage /var/www/bootstrap/cache /var/www

echo "📋 Copiando .env si no existe..."
[ -f .env ] || cp .env.example .env

echo "📦 Instalando dependencias..."
composer update --no-interaction --prefer-dist --optimize-autoloader

echo "🔑 Generando clave de aplicación..."
php artisan key:generate

echo "🚀 Iniciando supervisord..."
exec "$@"
