// import { test } from '@japa/runner'

// import type { Serialize } from '../src/types.js'

// test.group('Types | Serialize', () => {
//   test('original interface when every prop are already serialized', ({ expectTypeOf }) => {
//     interface MyInterface {
//       id: number
//       rank: number
//     }

//     type Serialized = Serialize<MyInterface>

//     expectTypeOf<Serialized>().toEqualTypeOf<{
//       id: number
//       rank: number
//     }>()
//   })

//   test('serialize non-json primitives', ({ expectTypeOf }) => {
//     interface MyInterface {
//       id: number
//       rank: number
//       date: Date
//     }

//     type Serialized = Serialize<MyInterface>

//     expectTypeOf<Serialized>().toEqualTypeOf<{
//       id: number
//       rank: number
//       date: string
//     }>()
//   })

//   test('use toJSON method when available', ({ expectTypeOf }) => {
//     interface MyInterface {
//       id: number
//       rank: number
//       date: Date
//       toJSON(): {
//         id: `id-${number}`
//         rank: `rank-${number}`
//         date: string
//       }
//     }

//     type Serialized = Serialize<MyInterface>

//     expectTypeOf<Serialized>().toEqualTypeOf<{
//       id: `id-${number}`
//       rank: `rank-${number}`
//       date: string
//     }>()
//   })

//   test('original interface when nested', ({ expectTypeOf }) => {
//     interface TranslationDTO {
//       de: string | null
//       en: string | null
//       fr: string | null
//       it: string | null
//       [key: string]: string | null | undefined
//     }

//     interface SponsorDTO {
//       id: number
//       name: TranslationDTO
//       logo: string
//       url: string
//       rank: number
//       createdAt: string
//       updatedAt: string
//     }

//     interface SponsorSectionDTO {
//       id: number
//       name: TranslationDTO
//       sponsors: SponsorDTO[]
//       rank: number
//       createdAt: string
//       updatedAt: string
//     }

//     type Serialized = Serialize<SponsorSectionDTO>

//     const serialized: SponsorSectionDTO = {
//       id: 1,
//       rank: 2,
//       createdAt: '2021-01-01',
//       updatedAt: '2021-01-01',
//       name: {
//         de: 'de',
//         en: 'en',
//         fr: 'fr',
//         it: 'it',
//       },
//       sponsors: [
//         {
//           id: 1,
//           rank: 2,
//           createdAt: '2021-01-01',
//           updatedAt: '2021-01-01',
//           name: {
//             de: 'de',
//             en: 'en',
//             fr: 'fr',
//             it: 'it',
//           },
//           logo: 'logo',
//           url: 'url',
//         },
//       ],
//     }

//     function data(data: SponsorSectionDTO) {
//       return data
//     }

//     data(serialized)

//     // expectTypeOf<Serialized['']>().toEqualTypeOf<{
//     //   id: number
//     //   rank: number
//     // }>()
//   })
// })
