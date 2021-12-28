module.exports = {
    reactStrictMode: true,
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            issuer: {
                // test: /\.(js|ts)x?$/,
                //    for webpack 5 use
                and: [/\.(js|ts)x?$/],
            },

            use: [
                {
                    loader: "@svgr/webpack",
                    options: {
                        svgoConfig: {
                            plugins: [
                                {
                                    name: "removeViewBox",
                                    active: false,
                                },
                            ],
                            removeViewBox: false,
                        },
                    },
                },
            ],
        });

        return config;
    },
};
