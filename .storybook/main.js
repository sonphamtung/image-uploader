module.exports = {
    stories: ['../stories/**/*.stories.tsx'],
    addons: ['@storybook/addon-actions', '@storybook/addon-links'],
    webpackFinal: async (config) => {
        // do mutation to the config

        // Fix issues with bundle svg following https://stackoverflow.com/a/61706308/10331102
        const fileLoaderRule = config.module.rules.find((rule) => rule.test && rule.test.test('.svg'));
        fileLoaderRule.exclude = /\.svg$/;

        config.module.rules.push(
            {
                test: /\.(ts|tsx)$/,
                use: [
                    {
                        loader: require.resolve('babel-loader'),
                        options: {
                            presets: ['@babel/react'],
                        },
                    },
                    {
                        loader: require.resolve('ts-loader'),
                    },
                    // Optional
                    {
                        loader: require.resolve('react-docgen-typescript-loader'),
                    },
                ],
            },
            {
                test: /\.svg$/,
                enforce: 'pre',
                loader: require.resolve('@svgr/webpack'),
            },
        );

        // add scss support
        config.module.rules.push({
            test: /\.scss$/,
            use: [
                require.resolve('style-loader'),
                {
                    loader: require.resolve('css-loader'),
                    options: {
                        importLoaders: 1,
                    },
                },
                {
                    loader: require.resolve('sass-loader'),
                },
            ],
        });

        config.resolve.extensions.push('.ts', '.tsx', '.js');
        return config;
    },
};
