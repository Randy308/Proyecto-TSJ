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
            // Posts
            "access posts",
            "create posts",
            "update posts",
            "delete posts",
            "create users",
            "update users",
            "delete users",
            // Users
            "create user",
            "update user",
            "delete user",
            // Additional permissions...
        ];

        // Map the permissions to the format required by the Permission model
        $permissions = collect($arrayOfPermissionNames)->map(function ($permission) {
            return ["name" => $permission, "guard_name" => "web"];
        });

        // Insert the permissions into the database
        Permission::insert($permissions->toArray());

        // Create roles and assign permissions
        Role::create(["name" => "admin"])->givePermissionTo(Permission::all());
        Role::create(["name" => "editor"])->givePermissionTo(['access posts', 'update posts']);
        Role::create(["name" => "user"])->givePermissionTo(['access posts',]);

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
