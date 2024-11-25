<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

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
            "ver_todas_resoluciones",
            "ver_todas_jurisprudencia",
            "crear_usuarios",
            "eliminar_usuarios",
            "actualizar_usuarios",
            "ver_usuarios",
            "crear_roles",
            "eliminar_roles",
            "actualizar_roles",
            "ver_roles",
            "asignar_permisos",
            "quitar_permisos",
            //Codificador
            "acceder_resoluciones",
            "subir_resoluciones",
            "actualizar_resoluciones",
            "eliminar_resoluciones",
            "acceder_jurisprudencia",
            "subir_jurisprudencia",
            "actualizar_jurisprudencia",
            "eliminar_jurisprudencia",

            "crear_publicacion",
            "eliminar_publicacion",
            "ver_publicacion",
            "actualizar_publicacion",
            // Users
            "realizar_prediccion",
            "refinar_busqueda",
            "crear_estilos",
            "eliminar_estilos",
            "ver_estilos",
            "actualizar_estilos",
            "actualizar_perfil",
            "eliminar_perfil",
            "ver_perfil",
            // Additional permissions...
        ];

        // Map the permissions to the format required by the Permission model
        $permissions = collect($arrayOfPermissionNames)->map(function ($permission) {
            return ["name" => $permission, "guard_name" => "sanctum"];
        });

        // Insert the permissions into the database
        Permission::insert($permissions->toArray());

        // Create roles and assign permissions
        Role::create(["name" => "admin", 'guard_name' => 'sanctum'])->givePermissionTo(Permission::all());
        Role::create(["name" =>"editor", 'guard_name' => 'sanctum'])->givePermissionTo([
            "acceder_resoluciones",
            "subir_resoluciones",
            "actualizar_resoluciones",
            "eliminar_resoluciones",
            "acceder_jurisprudencia",
            "subir_jurisprudencia",
            "actualizar_jurisprudencia",
            "eliminar_jurisprudencia",
            "crear_publicacion",
            "eliminar_publicacion",
            "ver_publicacion",
            "actualizar_publicacion",
            "realizar_prediccion",
            "refinar_busqueda",
            "crear_estilos",
            "eliminar_estilos",
            "ver_estilos",
            "actualizar_estilos",
            "actualizar_perfil",
            "eliminar_perfil",
            "ver_perfil",
        ]);
        Role::create(["name" => "user", 'guard_name' => 'sanctum'])->givePermissionTo([
            "realizar_prediccion",
            "refinar_busqueda",
            "crear_estilos",
            "eliminar_estilos",
            "ver_estilos",
            "actualizar_estilos",
            "actualizar_perfil",
            "eliminar_perfil",
            "ver_perfil",
        ]);

        // Assign roles to users
        // User::find(1)->assignRole('admin');
        // User::find(2)->assignRole('editor');
        // User::find(3)->assignRole('user');
        // Create test users
        $user1 = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password') // You can change the password
            ]
        );
        $user2 = User::firstOrCreate(
            ['email' => 'editor@example.com'],
            [
                'name' => 'Editor User',
                'password' => Hash::make('password') // You can change the password
            ]
        );
        $user3 = User::firstOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'Regular User',
                'password' => Hash::make('password') // You can change the password
            ]
        );

        // Assign roles
        $user1->assignRole('admin');
        $user2->assignRole('editor');
        $user3->assignRole('user');
    }
}
