import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import sveltePreprocess from 'svelte-preprocess';
import scss from 'rollup-plugin-scss'
import replace from '@rollup/plugin-replace';
import { generateSW } from 'rollup-plugin-workbox';

const preprocessOptions = require("./svelte.config").preprocessOptions;

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		replace({
			preventAssignment: false,
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.BACKEND_API_URL': JSON.stringify(process.env.BACKEND_API_URL || 'https://localhost:5001'),
    }),
		svelte({
			preprocess: sveltePreprocess(preprocessOptions),
			compilerOptions: {
				dev: !production
			},
			onwarn: (warning, handler) => {
        const { code, frame } = warning;
        if (code === "css-unused-selector")
            return;

        handler(warning);
    	}
		}),
		css({ output: 'bundle.css' }),
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		scss({
			output:false,
			}),
		commonjs(),
		!production && serve(),
		!production && livereload('public'),
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
