RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache /var/www
RUN cp .env.example .env
RUN composer install --no-interaction --optimize-autoloader \
&& composer update --no-interaction --optimize-autoloader \
    && php artisan key:generate \
    && php artisan migrate:fresh --seed 