import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';
import { writeFiles as writeEntityFiles } from './entity-files.mjs';
import { getPrimaryKeyValue as getPKValue, getJavaValueGeneratorForType as getJavaValueForType } from './support/index.mjs';
// import {generateKeyStore} from "../types/generators/server/support";
// import {writeFiles} from "./files.mjs";

export default class ServerGenerator extends BaseApplicationGenerator {
  get writingEntities() {
    return this.asWritingEntitiesTaskGroup({
      ...writeEntityFiles(),
    });
  }

  get [BaseApplicationGenerator.WRITING_ENTITIES]() {
    return this.asWritingEntitiesTaskGroup(this.delegateTasksToBlueprint(() => this.writingEntities));
  }

  getJavaValueGeneratorForType(type) {
    return getJavaValueForType(type);
  }
  /**
   * @private
   * Returns the primary key value based on the primary key type, DB and default value
   *
   * @param {string} primaryKey - the primary key type
   * @param {string} databaseType - the database type
   * @param {string} defaultValue - default value
   * @returns {string} java primary key value
   */
  getPrimaryKeyValue(primaryKey, databaseType = this.jhipsterConfig.databaseType, defaultValue = 1) {
    return getPKValue(primaryKey, databaseType, defaultValue);
  }
  /**
   * @private
   * Convert to Java bean name case
   *
   * Handle the specific case when the second letter is capitalized
   * See http://stackoverflow.com/questions/2948083/naming-convention-for-getters-setters-in-java
   *
   * @param {string} beanName name of the class to check
   * @return {string}
   */
  javaBeanCase(beanName) {
    return javaBeanClassNameFormat(beanName);
  }
  buildJavaGet(reference) {
    return javaGetCall(reference);
  }
  buildJavaGetter(reference, type = reference.type) {
    return javaGetter(reference, type);
  }
  buildJavaSetter(reference, valueDefinition = `${reference.type} ${reference.name}`) {
    return javaSetter(reference, valueDefinition);
  }
}
