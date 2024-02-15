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
export const SERVER_MAIN_RES_DIR = 'src/main/resources/';
export const SERVER_TEST_SRC_DIR = 'src/test/java/';
export const SERVER_TEST_RES_DIR = 'src/test/resources/';

export const MAIN_DIR = 'src/main/';
export const SERVER_MAIN_SRC_DIR = `${MAIN_DIR}java/`;

export const replaceEntityFilePathVariables = (data, filePath) => {
  filePath = filePath
    ?.replace(/_package_/, data.packageFolder)
    ?.replace(/_entityPackage_/, data.entityJavaPackageFolder)
    ?.replace(/_mainClass_/, data.mainClass)
    ?.replace(/_persistClass_/, data.persistClass)
    ?.replace(/_entityClass_/, data.entityClass)
    ?.replace(/_dtoClass_/, data.dtoClass);
  return filePath?.includes('.jhi.') ? filePath : filePath?.replace(/_\w*/, '');
};

export const moveToJavaPackageSrcDir = (data, filePath) =>
  `${data.javaPackageSrcDir}${replaceEntityFilePathVariables(data, filePath) ?? ''}`;

export function javaMainPackageTemplatesBlock(blockOrRelativePath = '') {
  return javaBlock({
    srcPath: `${SERVER_MAIN_SRC_DIR}_package_/`,
    destProperty: 'javaPackageSrcDir',
    blockOrRelativePath,
  });
}
export function javaMainResourceTemplatesBlock(blockOrRelativePath = '') {
  return javaBlock({
    srcPath: SERVER_MAIN_RES_DIR,
    destProperty: 'srcMainResources',
    blockOrRelativePath,
  });
}
export function javaTestResourceTemplatesBlock(blockOrRelativePath = '') {
  return javaBlock({
    srcPath: SERVER_TEST_RES_DIR,
    destProperty: 'srcTestResources',
    blockOrRelativePath,
  });
}
export function javaTestPackageTemplatesBlock(blockOrRelativePath = '') {
  return javaBlock({
    srcPath: `${SERVER_TEST_SRC_DIR}_package_/`,
    destProperty: 'javaPackageTestDir',
    blockOrRelativePath,
  });
}
function javaBlock({ srcPath, destProperty, blockOrRelativePath = '' }) {
  const block = typeof blockOrRelativePath !== 'string' ? blockOrRelativePath : undefined;
  const blockRenameTo = typeof block?.renameTo === 'function' ? block.renameTo : undefined;
  const relativePath = typeof blockOrRelativePath === 'string' ? blockOrRelativePath : blockOrRelativePath.relativePath ?? '';
  return {
    path: `${srcPath}${relativePath}`,
    ...block,
    renameTo(data, filePath) {
      return `${data[destProperty]}${replaceEntityFilePathVariables(data, relativePath) ?? ''}${
        replaceEntityFilePathVariables(data, blockRenameTo?.call?.(this, data, filePath) ?? filePath) ?? ''
      }`;
    },
  };
}
