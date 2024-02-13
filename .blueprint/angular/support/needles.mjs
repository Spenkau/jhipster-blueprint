import { createNeedleCallback } from '../../base/support/needles.mjs';
import { upperFirstCamelCase } from '../../base/support/string.mjs';
import { joinCallbacks } from '../../base/support/write-files.mjs';
export function addRoute({ needle, route, pageTitle, title, modulePath, moduleName, component }) {
  const routePath = `path: '${route}',`;
  // prettier-ignore
  const contentToAdd = `
    {
      ${routePath}${pageTitle ? `
      data: { pageTitle: '${pageTitle}' },` : ''}${title ? `
      title: '${title}',` : ''}
      load${component ? 'Component' : 'Children'}: () => import('${modulePath}')${moduleName ? `.then(m => m.${moduleName})` : ''},
    },`;
  return createNeedleCallback({
    needle,
    contentToAdd,
    contentToCheck: routePath,
  });
}
export function addEntitiesRoute({ application, entities }) {
  const { enableTranslation } = application;
  return joinCallbacks(
    ...entities.map(entity => {
      const { i18nKeyPrefix, entityClassPlural, entityFolderName, entityFileName, entityUrl } = entity;
      const pageTitle = enableTranslation ? `${i18nKeyPrefix}.home.title` : entityClassPlural;
      const modulePath = `./${entityFolderName}/${entityFileName}.routes`;
      return addRoute({
        needle: 'jhipster-needle-add-entity-route',
        route: entityUrl,
        modulePath,
        pageTitle,
      });
    }),
  );
}
export function addItemToMenu({ needle, enableTranslation, jhiPrefix, icon = 'asterisk', route, translationKey, name = '' }) {
  const routerLink = `routerLink="/${route}"`;
  const contentToAdd = `
        <li>
          <a class="dropdown-item" ${routerLink} routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="collapseNavbar()">
            <fa-icon icon="${icon}" [fixedWidth]="true"></fa-icon>
            <span${enableTranslation ? ` ${jhiPrefix}Translate="${translationKey}"` : ''}>${name}</span>
          </a>
        </li>`;
  return createNeedleCallback({
    needle,
    contentToAdd,
    contentToCheck: routerLink,
  });
}
export const addItemToAdminMenu = menu =>
  addItemToMenu({
    needle: 'add-element-to-admin-menu',
    ...menu,
  });
export const addIconImport = ({ icon }) => {
  const iconImport = `fa${upperFirstCamelCase(icon)}`;
  return createNeedleCallback({
    needle: 'jhipster-needle-add-icon-import',
    contentToCheck: new RegExp(`\\b${iconImport}\\b`),
    contentToAdd: (content, { indentPrefix }) =>
      content.replace(
        /(\r?\n)(\s*)\/\/ jhipster-needle-add-icon-import/g,
        `\n${indentPrefix}${iconImport},\n${indentPrefix}// jhipster-needle-add-icon-import`,
      ),
  });
};
export function addToEntitiesMenu({ application, entities }) {
  const { enableTranslation, jhiPrefix } = application;
  return joinCallbacks(
    ...entities.map(entity => {
      const { entityPage, entityTranslationKeyMenu, entityClassHumanized } = entity;
      const routerLink = `routerLink="/${entityPage}"`;
      // prettier-ignore
      const contentToAdd = `
        <li>
          <a class="dropdown-item" ${routerLink} routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="collapseNavbar()">
            <fa-icon icon="asterisk" [fixedWidth]="true"></fa-icon>
            <span${enableTranslation ? ` ${jhiPrefix}Translate="global.menu.entities.${entityTranslationKeyMenu}"` : ''}>${entityClassHumanized}</span>
          </a>
        </li>`;
      return createNeedleCallback({
        needle: 'jhipster-needle-add-entity-to-menu',
        contentToAdd,
        contentToCheck: routerLink,
      });
    }),
  );
}