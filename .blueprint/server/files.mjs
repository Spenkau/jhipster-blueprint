/**
 * Copyright 2013-2023 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see https://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import cleanupOldServerFiles from './cleanup.mjs';
import { SERVER_MAIN_SRC_DIR } from '../generator-constants.mjs';
import { addSectionsCondition, mergeSections } from '../base/support';
import { moveToJavaPackageSrcDir } from './support/index.mjs';

/**
 * The default is to use a file path string. It implies use of the template method.
 * For any other config an object { file:.., method:.., template:.. } can be used
 */
export const baseServerFiles = {
  serverJavaDomain: [
    {
      condition: generator =>
        generator.databaseTypeSql || generator.databaseTypeMongodb || generator.databaseTypeNeo4j || generator.databaseTypeCouchbase,
      path: `${SERVER_MAIN_SRC_DIR}_package_/`,
      renameTo: moveToJavaPackageSrcDir,
      templates: ['domain/AbstractAuditingEntity.java'],
    },
  ],

  serverJavaUserManagement: [
    {
      condition: generator => generator.generateBuiltInAuthorityEntity,
      path: `${SERVER_MAIN_SRC_DIR}_package_/`,
      renameTo: moveToJavaPackageSrcDir,
      templates: ['domain/Authority.java', 'repository/AuthorityRepository.java'],
    },
  ],
};
export const serverFiles = mergeSections(
  baseServerFiles,
  addSectionsCondition(jwtFiles, context => context.authenticationTypeJwt),
  addSectionsCondition(oauth2Files, context => context.authenticationTypeOauth2),
  addSectionsCondition(gatewayFiles, context => context.applicationTypeGateway),
  addSectionsCondition(accountFiles, context => context.generateAuthenticationApi),
  addSectionsCondition(userManagementFiles, context => context.generateUserManagement),
  addSectionsCondition(imperativeConfigFiles, context => !context.reactive),
  addSectionsCondition(reactiveConfigFiles, context => context.reactive),
  addSectionsCondition(swaggerFiles, context => context.enableSwaggerCodegen),
);
/**
 * @this {import('./index.mjs')}
 */
export function writeFiles() {
  return this.asWritingTaskGroup({
    cleanupOldServerFiles,
    async writeFiles({ application }) {
      return this.writeFiles({
        sections: serverFiles,
        context: application,
      });
    },
  });
}
