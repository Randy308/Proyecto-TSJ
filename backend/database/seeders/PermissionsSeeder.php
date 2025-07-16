<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Forget cached permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Define an array of permission names
        $arrayOfPermissionNames = [
            // Admin
            'administrar_datos',
            'subir_resoluciones',
            'subir_jurisprudencia',
            'realizar_web_scrapping',
            'actualizar_resoluciones',
            'actualizar_jurisprudencia',
            'validar_datos',
            'modificar_datos',
            'crear_estilo',
            'eliminar_estilo',
            'ver_estilo',
            'actualizar_estilo',
            // usuarios
            'crear_usuarios',
            'eliminar_usuarios',
            'actualizar_usuarios',
            'ver_usuarios',
            // roles
            'crear_roles',
            'eliminar_roles',
            'actualizar_roles',
            'ver_roles',
            "ajustar_fechas",
            "ajustar_departamentos",
            "generar_nodos",
            "obtener_terminos_clave",
        ];

        // Map the permissions to the format required by the Permission model
        $permissions = collect($arrayOfPermissionNames)->map(function ($permission) {
            return ['name' => $permission, 'guard_name' => 'sanctum'];
        });

        // Insert the permissions into the database
        Permission::insert($permissions->toArray());

        // Create roles and assign permissions
        Role::create(['name' => 'admin', 'guard_name' => 'sanctum'])->givePermissionTo(Permission::all());
        Role::create(['name' => 'editor', 'guard_name' => 'sanctum'])->givePermissionTo([
            'administrar_datos',
            'subir_resoluciones',
            'subir_jurisprudencia',
            'realizar_web_scrapping',
            'actualizar_resoluciones',
            'actualizar_jurisprudencia',
            'validar_datos',
            'modificar_datos',
            'crear_estilo',
            'eliminar_estilo',
            'ver_estilo',
            'actualizar_estilo',
        ]);
        Role::create(['name' => 'user', 'guard_name' => 'sanctum'])->givePermissionTo([
            'crear_estilo',
            'eliminar_estilo',
            'ver_estilo',
            'actualizar_estilo',
        ]);

        $user = User::firstOrCreate(
            [
                'email' => 'admin308@gmail.com',
                'name' => 'Admin User',
                'password' => Hash::make(env('USER_PASSWORD', 'password')), // You can change the password
            ]
        );
        // Assign roles
        $user->assignRole('admin');
    }
}
