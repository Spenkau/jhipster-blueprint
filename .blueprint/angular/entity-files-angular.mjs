import { clientApplicationTemplatesBlock } from 'generator-jhipster/generators/client/support';
export const angularFiles = {
  client: [
    {
      condition: generator => !generator.embedded,
      ...clientApplicationTemplatesBlock(),
      templates: [
        'entities/_entityFolder_/_entityFile_.routes.ts',
        'entities/_entityFolder_/detail/_entityFile_-detail.component.html',
        'entities/_entityFolder_/detail/_entityFile_-detail.component.ts',
        'entities/_entityFolder_/copy/_entityFile_-copy.component.html',
        'entities/_entityFolder_/copy/_entityFile_-copy.component.ts',
        'entities/_entityFolder_/list/_entityFile_.component.html',
        'entities/_entityFolder_/list/_entityFile_.component.ts',
        'entities/_entityFolder_/service/_entityFile_.service.ts',
      ],
    },
  ],
};
export async function writeEntitiesFiles({ application, entities }) {
  for (const entity of entities.filter(entity => !entity.skipClient && !entity.builtIn)) {
    await this.writeFiles({
      sections: angularFiles,
      context: { ...application, ...entity },
    });
  }
}
export async function postWriteEntitiesFiles(taskParam) {
  const { source, application } = taskParam;
  const entities = taskParam.entities.filter(entity => !entity.skipClient && !entity.builtIn && !entity.embedded);
  source.addEntitiesToClient({ application, entities });
}
export function cleanupEntitiesFiles({ application, entities }) {
  for (const entity of entities.filter(entity => !entity.skipClient && !entity.builtIn)) {
    const { entityFolderName, entityFileName, name: entityName } = entity;
    if (this.isJhipsterVersionLessThan('5.0.0')) {
      this.removeFile(`${application.clientSrcDir}app/entities/${entityName}/${entityName}.model.ts`);
    }
    if (this.isJhipsterVersionLessThan('6.3.0')) {
      this.removeFile(`${application.clientSrcDir}app/entities/${entityFolderName}/index.ts`);
    }
    if (this.isJhipsterVersionLessThan('7.0.0-beta.0')) {
      this.removeFile(`${application.clientSrcDir}/app/entities/${entityFolderName}/${entityFileName}.route.ts`);
      this.removeFile(`${application.clientSrcDir}/app/entities/${entityFolderName}/${entityFileName}.component.ts`);
      this.removeFile(`${application.clientSrcDir}/app/entities/${entityFolderName}/${entityFileName}.component.html`);
      this.removeFile(`${application.clientSrcDir}/app/entities/${entityFolderName}/${entityFileName}-detail.component.ts`);
      this.removeFile(`${application.clientSrcDir}/app/entities/${entityFolderName}/${entityFileName}-detail.component.html`);
      this.removeFile(`${application.clientSrcDir}/app/entities/${entityFolderName}/${entityFileName}-delete-dialog.component.ts`);
      this.removeFile(`${application.clientSrcDir}/app/entities/${entityFolderName}/${entityFileName}-delete-dialog.component.html`);
      this.removeFile(`${application.clientSrcDir}/app/entities/${entityFolderName}/${entityFileName}-update.component.ts`);
      this.removeFile(`${application.clientSrcDir}/app/entities/${entityFolderName}/${entityFileName}-update.component.html`);
      this.removeFile(`${application.clientSrcDir}/app/shared/model/${entity.entityModelFileName}.model.ts`);
      entity.fields.forEach(field => {
        if (field.fieldIsEnum === true) {
          const { enumFileName } = field;
          this.removeFile(`${application.clientSrcDir}/app/shared/model/enumerations/${enumFileName}.model.ts`);
        }
      });
      this.removeFile(`${application.clientSrcDir}/app/entities/${entityFolderName}/${entityFileName}-routing-resolve.service.ts`);
      this.removeFile(`${application.clientSrcDir}/app/entities/${entityFolderName}/${entityFileName}-routing.module.ts`);
      this.removeFile(`${application.clientSrcDir}/app/entities/${entityFolderName}/${entityFileName}.service.ts`);
      this.removeFile(`${application.clientSrcDir}/app/entities/${entityFolderName}/${entityFileName}.service.spec.ts`);
      this.removeFile(`${application.clientTestDir}/spec/app/entities/${entityFolderName}/${entityFileName}.component.spec.ts`);
      this.removeFile(`${application.clientTestDir}/spec/app/entities/${entityFolderName}/${entityFileName}-detail.component.spec.ts`);
      this.removeFile(
        `${application.clientTestDir}/spec/app/entities/${entityFolderName}/${entityFileName}-delete-dialog.component.spec.ts`,
      );
      this.removeFile(`${application.clientTestDir}/spec/app/entities/${entityFolderName}/${entityFileName}-update.component.spec.ts`);
      this.removeFile(`${application.clientTestDir}/spec/app/entities/${entityFolderName}/${entityFileName}.service.spec.ts`);
    }
    if (this.isJhipsterVersionLessThan('7.10.0')) {
      this.removeFile(`${application.clientSrcDir}app/entities/${entityFolderName}/${entityFileName}.module.ts`);
      this.removeFile(`${application.clientSrcDir}app/entities/${entityFolderName}/route/${entityFileName}-routing.module.ts`);
    }
  }
}
