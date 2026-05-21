# Changelog

## [3.2.0](https://github.com/chebert-pd/big-wylly-style/compare/big-wylly-style@3.1.0...big-wylly-style@3.2.0) (2026-05-21)


### Features

* **governance:** add `audit-governance discover` — fuzzy shadow-composite detector ([#140](https://github.com/chebert-pd/big-wylly-style/issues/140)) ([75efb6c](https://github.com/chebert-pd/big-wylly-style/commit/75efb6cc91fb34ce0e892d4241afdcf18cfd19ab))

## [3.1.0](https://github.com/chebert-pd/big-wylly-style/compare/big-wylly-style@3.0.0...big-wylly-style@3.1.0) (2026-05-21)


### Features

* **governance:** add CO-005 — flag shadow-primitive imports in consumers ([#137](https://github.com/chebert-pd/big-wylly-style/issues/137)) ([3b45899](https://github.com/chebert-pd/big-wylly-style/commit/3b458996259b2821bcb18f18850b0e9a194dbadb))

## [3.0.0](https://github.com/chebert-pd/big-wylly-style/compare/big-wylly-style@2.11.0...big-wylly-style@3.0.0) (2026-05-20)


### ⚠ BREAKING CHANGES

* the npm package is renamed from @chebert-pd/ui to @big-wylly-style/ui. Consumers must update their imports and dependency declarations. The only known consumers (this gallery + a test app in a separate repo) are updated in this PR or will be migrated separately.

### Features

* rename design system to Big Wylly Style ([#132](https://github.com/chebert-pd/big-wylly-style/issues/132)) ([34d4b24](https://github.com/chebert-pd/big-wylly-style/commit/34d4b2490a1ee6901e7503931c8cac4de5160a54))

## [2.11.0](https://github.com/chebert-pd/big-wylly-style/compare/wyllo-ui@2.10.0...wyllo-ui@2.11.0) (2026-05-13)


### Features

* **ui:** bundle governance-auditor Claude skill in @chebert-pd/ui ([#118](https://github.com/chebert-pd/big-wylly-style/issues/118)) ([1768954](https://github.com/chebert-pd/big-wylly-style/commit/17689548c6d6ad32a36b6b3109ca8baba3cb348a))

## [2.10.0](https://github.com/chebert-pd/big-wylly-style/compare/wyllo-ui@2.9.0...wyllo-ui@2.10.0) (2026-05-13)


### Features

* **ui:** enforce 5 previously-documented-only rules (LC-001, BD-002, EL-002, FG-002, SF-001) ([#113](https://github.com/chebert-pd/big-wylly-style/issues/113)) ([e182a48](https://github.com/chebert-pd/big-wylly-style/commit/e182a4875e3d733f2e6c124bf69294cfef5534b3))
* **ui:** metadata schema validation + JSON output for --print-issue ([#115](https://github.com/chebert-pd/big-wylly-style/issues/115)) ([a7cb255](https://github.com/chebert-pd/big-wylly-style/commit/a7cb255b77b4a24ac76aa437e015deb6e19ed4ed))

## [2.9.0](https://github.com/chebert-pd/big-wylly-style/compare/wyllo-ui@2.8.0...wyllo-ui@2.9.0) (2026-05-11)


### Features

* **ui:** enforce composition (CO), code-style (CS), and Card-ghost (SF-002) rules ([#107](https://github.com/chebert-pd/big-wylly-style/issues/107)) ([fd28d01](https://github.com/chebert-pd/big-wylly-style/commit/fd28d01b42ddec60a504ec3fb7974e1dfbadf5a2))


### Bug Fixes

* **ui:** LC-003 should not fire inside modal/sheet/dialog/drawer surfaces ([#112](https://github.com/chebert-pd/big-wylly-style/issues/112)) ([2cbc43e](https://github.com/chebert-pd/big-wylly-style/commit/2cbc43eb7b2c42e09eb3b77d095ef5cb666bf51d))

## [2.8.0](https://github.com/chebert-pd/big-wylly-style/compare/wyllo-ui@2.7.0...wyllo-ui@2.8.0) (2026-05-08)


### Features

* metadata-derived rules, drift checker, governance-auditor skill, deterministic hook ([#106](https://github.com/chebert-pd/big-wylly-style/issues/106)) ([342acc4](https://github.com/chebert-pd/big-wylly-style/commit/342acc46c122fb88da7e3a9dd428ed81cf4e24e6))
* **ui:** enforce iconography rules IC-002 / IC-003 / IC-004 / IC-005 ([#104](https://github.com/chebert-pd/big-wylly-style/issues/104)) ([17cc0c3](https://github.com/chebert-pd/big-wylly-style/commit/17cc0c3bea106f913f217fab73466504c04087dd))

## [2.7.0](https://github.com/chebert-pd/big-wylly-style/compare/wyllo-ui@2.6.1...wyllo-ui@2.7.0) (2026-05-08)


### Features

* **ui:** add PageLayout / PageContainer / Stack + layout governance ([#101](https://github.com/chebert-pd/big-wylly-style/issues/101)) ([13e069c](https://github.com/chebert-pd/big-wylly-style/commit/13e069c5de4609f6b4f70407da44c6d8fee5e975))

## [2.6.1](https://github.com/chebert-pd/big-wylly-style/compare/wyllo-ui@2.6.0...wyllo-ui@2.6.1) (2026-05-05)


### Bug Fixes

* **ui:** round font-[525] outliers to standard weights ([#91](https://github.com/chebert-pd/big-wylly-style/issues/91)) ([dd22cc3](https://github.com/chebert-pd/big-wylly-style/commit/dd22cc362934fb8df8fbaab912e16a9da56eb46e))

## [2.6.0](https://github.com/chebert-pd/big-wylly-style/compare/wyllo-ui@2.5.1...wyllo-ui@2.6.0) (2026-05-04)


### Features

* **ui:** add TY-004 typography preset enforcement ([#87](https://github.com/chebert-pd/big-wylly-style/issues/87)) ([09050d3](https://github.com/chebert-pd/big-wylly-style/commit/09050d3a5260312a0cc0cfe0ae85e6d2c3d1de09))


### Bug Fixes

* **ui:** scope TY-003 uppercase check to className/cn/style contexts ([#86](https://github.com/chebert-pd/big-wylly-style/issues/86)) ([2fe53ba](https://github.com/chebert-pd/big-wylly-style/commit/2fe53bac6e17772713cacdb4a3bbea3169a8be4e))

## [2.5.1](https://github.com/chebert-pd/big-wylly-style/compare/wyllo-ui@2.5.0...wyllo-ui@2.5.1) (2026-05-04)


### Bug Fixes

* **ui:** adopt preset typography utilities to eliminate component drift ([#82](https://github.com/chebert-pd/big-wylly-style/issues/82)) ([a560051](https://github.com/chebert-pd/big-wylly-style/commit/a5600512cf7ef33ad4a7ce0fd7588ee24aef8fca))

## [2.5.0](https://github.com/chebert-pd/big-wylly-style/compare/wyllo-ui@2.4.0...wyllo-ui@2.5.0) (2026-05-03)


### Features

* **ui:** add Wyllolabs theme variant ([#79](https://github.com/chebert-pd/big-wylly-style/issues/79)) ([e7c101e](https://github.com/chebert-pd/big-wylly-style/commit/e7c101e58f4d709659c4431ebdbbd7f1bc7eebc5))

## [2.4.0](https://github.com/chebert-pd/big-wylly-style/compare/wyllo-ui@2.3.1...wyllo-ui@2.4.0) (2026-05-02)


### Features

* **ui:** add TY-003 governance rule — no uppercase styling on text ([#77](https://github.com/chebert-pd/big-wylly-style/issues/77)) ([632a36f](https://github.com/chebert-pd/big-wylly-style/commit/632a36f4e98b3af3536c375251e5aca9ab76c607))

## [2.3.1](https://github.com/chebert-pd/big-wylly-style/compare/wyllo-ui@2.3.0...wyllo-ui@2.3.1) (2026-05-02)


### Bug Fixes

* **ui:** document --font-sans requirement in globals.css header ([#75](https://github.com/chebert-pd/big-wylly-style/issues/75)) ([2015462](https://github.com/chebert-pd/big-wylly-style/commit/20154627766ce8900a866140b8facfd947e03981))

## [2.3.0](https://github.com/chebert-pd/big-wylly-style/compare/wyllo-ui@2.2.2...wyllo-ui@2.3.0) (2026-05-01)


### Features

* **ui:** ship per-component subpath exports ([7e9556a](https://github.com/chebert-pd/big-wylly-style/commit/7e9556a61548a589ac5da06ccdd2813ff63dccea))


### Bug Fixes

* **ui:** emit .d.ts files via tsup dts ([#74](https://github.com/chebert-pd/big-wylly-style/issues/74)) ([290be10](https://github.com/chebert-pd/big-wylly-style/commit/290be10e03fe08f10c36a1317ca0f729b8ed5ec9))

## [2.2.2](https://github.com/chebert-pd/big-wylly-style/compare/wyllo-ui@2.2.1...wyllo-ui@2.2.2) (2026-04-30)


### Bug Fixes

* **ui:** correct mobile sidebar inner-width overflow ([d9b538b](https://github.com/chebert-pd/big-wylly-style/commit/d9b538b1431ebca9b8cdfcf46035c8efd0f66fa0))

## [2.2.1](https://github.com/chebert-pd/big-wylly-style/compare/wyllo-ui@2.2.0...wyllo-ui@2.2.1) (2026-04-29)


### Bug Fixes

* **ui:** ship component source TSX files with the package ([#63](https://github.com/chebert-pd/big-wylly-style/issues/63)) ([8f38b68](https://github.com/chebert-pd/big-wylly-style/commit/8f38b688ef987909980bc7fc9b0eb5676bc3796c))

## [2.2.0](https://github.com/chebert-pd/big-wylly-style/compare/wyllo-ui@2.1.0...wyllo-ui@2.2.0) (2026-04-28)


### Features

* governance auditor baseline mode + suggest-suppressions ([#57](https://github.com/chebert-pd/big-wylly-style/issues/57)) ([aaf84b2](https://github.com/chebert-pd/big-wylly-style/commit/aaf84b2432a025a85e9a9be000eba36c7b4f0ef4))
* governance auditor CLI with consumer-app support ([#55](https://github.com/chebert-pd/big-wylly-style/issues/55)) ([8692756](https://github.com/chebert-pd/big-wylly-style/commit/86927563836ac22ea20da1e8f672e160a65f1429))
* governance auditor foundation (tests, appliesTo, severity, justification) ([#56](https://github.com/chebert-pd/big-wylly-style/issues/56)) ([69cd757](https://github.com/chebert-pd/big-wylly-style/commit/69cd757a07f6181fbb3266a844d24736395fc1fa))
* SARIF output, multi-package-manager support, case study readability + Part Four ([#58](https://github.com/chebert-pd/big-wylly-style/issues/58)) ([20fcf8d](https://github.com/chebert-pd/big-wylly-style/commit/20fcf8d6d011a76a0491ed69bc4dae4861b32de7))
* **ui:** SidebarPage primitives + command palette refresh ([75f4041](https://github.com/chebert-pd/big-wylly-style/commit/75f4041dc28a6a9c71d287611478824b5346cc9f))

## [2.1.0](https://github.com/chebert-pd/big-wylly-style/compare/wyllo-ui@2.0.0...wyllo-ui@2.1.0) (2026-04-22)


### Features

* add named chart color palettes ([#51](https://github.com/chebert-pd/big-wylly-style/issues/51)) ([4f0e616](https://github.com/chebert-pd/big-wylly-style/commit/4f0e6162a2a48e18c9b75a7ec942a1b31401715a))

## [2.0.0](https://github.com/chebert-pd/big-wylly-style/compare/wyllo-ui@1.1.0...wyllo-ui@2.0.0) (2026-04-21)


### ⚠ BREAKING CHANGES

* consumers must update import paths from @wyllo/ui to @chebert-pd/ui. Nothing has been published yet, so no external consumers are affected.

### Miscellaneous Chores

* rename package to @chebert-pd/ui ([#35](https://github.com/chebert-pd/big-wylly-style/issues/35)) ([3336143](https://github.com/chebert-pd/big-wylly-style/commit/33361439e96ab307a58760966d91536476bc92de))

## [1.1.0](https://github.com/chebert-pd/big-wylly-style/compare/wyllo-ui@1.0.0...wyllo-ui@1.1.0) (2026-04-21)


### Features

* add agentic skills gallery page, fix codebase indexer, update CI paths ([7d4de89](https://github.com/chebert-pd/big-wylly-style/commit/7d4de89b05e77ebab251823ddfd313d2f1fb451a))
* add StatBlock, Steps, Timeline; remove StatCard/StatsGrid ([#28](https://github.com/chebert-pd/big-wylly-style/issues/28)) ([32d6033](https://github.com/chebert-pd/big-wylly-style/commit/32d60334630043b987b1ac5982fa339aa41c2d4d))
* chart system, error states, button rules, card ghost tone, CLAUDE.md overhaul ([d31f25e](https://github.com/chebert-pd/big-wylly-style/commit/d31f25e4b70a3dd379b9773e35251437eb3d2dc7))
* component fixes, new patterns, icon governance, header subsection ([04b13bf](https://github.com/chebert-pd/big-wylly-style/commit/04b13bfda7ca3e5fe9cac1b8ff156d9d3469a2bd))
* governance auditor, metadata for all components, font weight migration, case studies ([757932e](https://github.com/chebert-pd/big-wylly-style/commit/757932e6c138b072b2d89e0b67eb5fb38fa90c60))
* restructure into monorepo with @chebert-pd/ui package and gallery app ([9b6b99e](https://github.com/chebert-pd/big-wylly-style/commit/9b6b99e8bdb5164b40ec05b1313433ae18091fcf))
