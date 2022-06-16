const common = [
  'test/features/**/*.feature',
  '--require-module ts-node/register', // Load TypeScript module
  '--require test/features/step_definitions/**/*.ts',
  '--publish-quiet'
].join(' ')

module.exports = {
  default: common
}
