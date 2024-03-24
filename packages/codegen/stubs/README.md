# The stubs directory

The `stubs` directory stores all the stubs needed by your package. It could be config files you will publish during the initial setup or stubs you want to use within the scaffolding commands.

- Inside the `package.json` file, we have defined a `copy:templates` script that copies the `stubs` folder to the `build` folder.
- Ensure the `build/stubs` are always published to npm via the `files` array inside the `package.json` file.
