/*
|--------------------------------------------------------------------------
| Configure hook
|--------------------------------------------------------------------------
|
| The configure hook is called when someone runs "node ace configure <package>"
| command. You are free to perform any operations inside this function to
| configure the package.
|
| To make things easier, you have access to the underlying "ConfigureCommand"
| instance and you can use codemods to modify the source files.
|
*/

import type ConfigureCommand from '@adonisjs/core/commands/configure'

import { stubsRoot } from './stubs/main.js'

export async function configure(command: ConfigureCommand) {
  const codemods = await command.createCodemods()

  await codemods.updateRcFile((rcFile) => {
    rcFile.addCommand('@tuyau/core/commands')
    rcFile.addProvider('@tuyau/core/tuyau_provider')
  })

  await codemods.installPackages([
    {
      isDevDependency: true,
      name: '@tuyau/utils',
    },
  ])

  await codemods.makeUsingStub(stubsRoot, 'config/tuyau.stub', {})
}
