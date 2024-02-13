// import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';
// import { writeFiles } from './files-angular.mjs';
//
// export default class extends BaseApplicationGenerator {
//   constructor(args, opts, features) {
//     super(args, opts, { ...features, sbsBlueprint: true });
//   }
//
//   get [BaseApplicationGenerator.WRITING]() {
//     const files = this.asWritingTaskGroup({
//       ...super.writing,
//       writeFiles,
//       async writingTemplateTask({ application }) {
//         this.fs.copyTpl(
//           this.templatePath('src/main/webapp/app/entities/_entityFolder/list/_entityFile.component.html.ejs'),
//           this.destinationPath('src/main/webapp/app/entities/_entityFolder/list/_entityFile.component.html.ts'),
//           {
//             entityClass: this.props.entityClass,
//           },
//         );
//       },
//     });
//     // return this.asWritingTaskGroup({
//     //   async writingTemplateTask({ application }) {
//     //     await this.writeFiles({
//     //       sections: {
//     //         files: [{ templates: ['template-file-angular'] }],
//     //       },
//     //       context: application,
//     //     });
//     //   },
//     // });
//     return files;
//   }
//
//   get [BaseApplicationGenerator.WRITING_ENTITIES]() {
//     return this.asWritingEntitiesTaskGroup({
//       async writingEntitiesTemplateTask() {},
//     });
//   }
// }

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
import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';
import { writeEntitiesFiles, postWriteEntitiesFiles, cleanupEntitiesFiles } from './entity-files-angular.mjs';
import { writeFiles } from './files-angular.mjs';
import cleanupOldFilesTask from './cleanup.mjs';

export default class AngularGenerator extends BaseApplicationGenerator {
  localEntities;

  get writingEntities() {
    return this.asWritingEntitiesTaskGroup({
      cleanupEntitiesFiles,
      writeEntitiesFiles,
    });
  }
  get [BaseApplicationGenerator.WRITING_ENTITIES]() {
    return this.delegateTasksToBlueprint(() => this.writingEntities);
  }
  // get postWritingEntities() {
  //     return this.asPostWritingEntitiesTaskGroup({
  //         postWriteEntitiesFiles,
  //     });
  // }
  // get [BaseApplicationGenerator.POST_WRITING_ENTITIES]() {
  //     return this.delegateTasksToBlueprint(() => this.postWritingEntities);
  // }
}
