const sveltePreprocess = require('svelte-preprocess');
const production = !process.env.ROLLUP_WATCH;
const preprocessOptions = {
    sourceMap: !production,
    defaults:{
      style: 'scss'
    },
    scss: {
      prependData: `@import 'src/styles/variables.scss'; @import 'src/styles/global.scss';`
    }
}

module.exports = {
  preprocess: sveltePreprocess(preprocessOptions),
  preprocessOptions
 };