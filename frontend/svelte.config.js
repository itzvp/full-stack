// svelte.config.js
import preprocess from "svelte-preprocess";
import tailwindcss from "tailwindcss";

const config = {
  preprocess: preprocess({
    postcss: {
      plugins: [tailwindcss],
    },
  }),
  // Other configurations
};

export default config;
