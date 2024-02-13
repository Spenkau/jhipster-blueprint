import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';
import { writeFiles } from './files-angular.mjs';

export default class extends BaseApplicationGenerator {
  constructor(args, opts, features) {
    super(args, opts, { ...features, sbsBlueprint: true });
  }

  get [BaseApplicationGenerator.WRITING]() {
    const files = this.asWritingTaskGroup({
      ...super.writing,
      writeFiles,
      async writingTemplateTask({ application }) {
        this.fs.copyTpl(
          this.templatePath('src/main/webapp/app/entities/_entityFolder/list/_entityFile.component.html.ejs'),
          this.destinationPath('src/main/webapp/app/entities/_entityFolder/list/_entityFile.component.html.ts'),
          {
            entityClass: this.props.entityClass,
          },
        );
      },
    });
    // return this.asWritingTaskGroup({
    //   async writingTemplateTask({ application }) {
    //     await this.writeFiles({
    //       sections: {
    //         files: [{ templates: ['template-file-angular'] }],
    //       },
    //       context: application,
    //     });
    //   },
    // });
    return files;
  }

  get [BaseApplicationGenerator.WRITING_ENTITIES]() {
    return this.asWritingEntitiesTaskGroup({
      async writingEntitiesTemplateTask() {},
    });
  }
}
