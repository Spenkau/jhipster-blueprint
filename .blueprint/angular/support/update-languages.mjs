import { updateLanguagesInDayjsConfigurationTask } from '../../client/support/index.mjs';
import { generateLanguagesWebappOptions } from '../../languages/support/index.mjs';
function updateLanguagesInPipeTask({ application, control = {} }) {
  const { clientSrcDir, languagesDefinition = [] } = application;
  const { ignoreNeedlesError: ignoreNonExisting } = control;
  const newContent = `{
        ${generateLanguagesWebappOptions(languagesDefinition).join(',\n        ')}
      // jhipster-needle-i18n-language-key-pipe - JHipster will add/remove languages in this object
  };
`;
  this.editFile(`${clientSrcDir}app/shared/language/find-language-from-key.pipe.ts`, { ignoreNonExisting }, content =>
    content.replace(/{\s*('[a-z-]*':)?([^=]*jhipster-needle-i18n-language-key-pipe[^;]*)\};/g, newContent),
  );
}
function updateLanguagesInConstantsTask({ application, control = {} }) {
  const { clientSrcDir, languages } = application;
  const { ignoreNeedlesError: ignoreNonExisting } = control;
  let newContent = 'export const LANGUAGES: string[] = [\n';
  languages?.forEach(lang => {
    newContent += `    '${lang}',\n`;
  });
  newContent += '    // jhipster-needle-i18n-language-constant - JHipster will add/remove languages in this array\n];';
  this.editFile(`${clientSrcDir}app/config/language.constants.ts`, { ignoreNonExisting }, content =>
    content.replace(/export.*LANGUAGES.*\[([^\]]*jhipster-needle-i18n-language-constant[^\]]*)\];/g, newContent),
  );
}
function updateLanguagesInWebpackTask({ application, control = {} }) {
  const { clientSrcDir, clientRootDir, languages } = application;
  const { ignoreNeedlesError: ignoreNonExisting } = control;
  let newContent = 'groupBy: [\n';
  const srcRelativePath = this.relativeDir(clientRootDir, clientSrcDir);
  languages?.forEach(language => {
    newContent += `                    { pattern: "./${srcRelativePath}i18n/${language}/*.json", fileName: "./i18n/${language}.json" },\n`;
  });
  newContent +=
    '                    // jhipster-needle-i18n-language-webpack - JHipster will add/remove languages in this array\n' +
    '                ]';
  this.editFile(`${clientRootDir}webpack/webpack.custom.js`, { ignoreNonExisting }, content =>
    content.replace(/groupBy:.*\[([^\]]*jhipster-needle-i18n-language-webpack[^\]]*)\]/g, newContent),
  );
}
export default function updateLanguagesTask(param) {
  updateLanguagesInPipeTask.call(this, param);
  updateLanguagesInConstantsTask.call(this, param);
  updateLanguagesInWebpackTask.call(this, param);
  updateLanguagesInDayjsConfigurationTask.call(this, param, { configurationFile: `${param.application.clientSrcDir}app/config/dayjs.ts` });
}