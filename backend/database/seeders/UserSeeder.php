<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
        $arrayOfPermissionNames = [
            'crear_cronologias',
            'ver_dashboard',
        ];

        $permissions = collect($arrayOfPermissionNames)->map(function ($permission) {
            return ['name' => $permission, 'guard_name' => 'sanctum'];
        });

        // Insert the permissions into the database
        Permission::upsert(
            $permissions->toArray(),
            ['name', 'guard_name'], // claves únicas
            ['name'] // columnas a actualizar si ya existe
        );

        $adminRole = Role::findByName('admin', 'sanctum');
        if ($adminRole) {
            foreach ($permissions as $permission) {
                $adminRole->givePermissionTo($permission['name']);
            }
        }
    }
}
