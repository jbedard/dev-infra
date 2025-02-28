/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Arguments, Argv, CommandModule} from 'yargs';

import {GitClient} from '../../utils/git/git-client';
import {assertValidReleaseConfig, NpmPackage} from '../config/index';
import {fetchActiveReleaseTrains} from '../versioning/active-release-trains';
import {printActiveReleaseTrains} from '../versioning/print-active-trains';
import {getNextBranchName, ReleaseRepoWithApi} from '../versioning';
import {getConfig} from '../../utils/config';

/**
 * Type describing the JSON output of this command.
 *
 * @important When changing this, make sure the release action
 *   invocation is updated as well.
 */
export type ReleaseInfoJsonStdout = {npmPackages: NpmPackage[]};

/** Command line options for printing release information. */
export interface ReleaseInfoOptions {
  json: boolean;
}

/** Yargs command builder for the `ng-dev release info` command. */
function builder(argv: Argv): Argv<ReleaseInfoOptions> {
  return argv.option('json', {
    type: 'boolean',
    description: 'Whether information should be written as JSON to stdout.',
    default: false,
  });
}

/** Yargs command handler for printing release information. */
async function handler(argv: Arguments<ReleaseInfoOptions>) {
  const config = getConfig();
  assertValidReleaseConfig(config);

  // If JSON output is requested, print the information as JSON to stdout.
  if (argv.json) {
    process.stdout.write(JSON.stringify(<ReleaseInfoJsonStdout>config.release, null, 2));
    return;
  }

  const git = GitClient.get();
  const nextBranchName = getNextBranchName(git.config.github);
  const repo: ReleaseRepoWithApi = {api: git.github, ...git.remoteConfig, nextBranchName};
  const releaseTrains = await fetchActiveReleaseTrains(repo);

  // Print the active release trains.
  await printActiveReleaseTrains(releaseTrains, config.release);
}

/** CLI command module for retrieving release information. */
export const ReleaseInfoCommandModule: CommandModule<{}, ReleaseInfoOptions> = {
  builder,
  handler,
  command: 'info',
  describe: 'Prints information for the current release state.',
};
