export { default } from './generator.mjs';

// const AngularGenerator = require('generator-jhipster/generators/angular');
//
// module.exports = class extends AngularGenerator {
//     constructor(args, opts) {
//         super(args, Object.assign({ fromBlueprint: true }, opts)); // fromBlueprint variable is important
//
//         const jhContext = this.jhipsterContext = this.options.jhipsterContext;
//
//         if (!jhContext) {
//             this.error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprint avdev4j')}`);
//         }
//
//         this.configOptions = jhContext.configOptions || {};
//         // This sets up options for this sub generator and is being reused from JHipster
//         jhContext.setupClientOptions(this, jhContext);
//     }
// }
