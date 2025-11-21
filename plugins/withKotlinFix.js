const { withProjectBuildGradle } = require('expo/config-plugins');

module.exports = function withKotlinFix(config) {
    return withProjectBuildGradle(config, (config) => {
        if (config.modResults.language === 'groovy') {
            // Replace kotlinVersion with 2.1.0
            const kotlinVersionPattern = /kotlinVersion\s*=\s*['"].*['"]/;
            if (kotlinVersionPattern.test(config.modResults.contents)) {
                config.modResults.contents = config.modResults.contents.replace(
                    kotlinVersionPattern,
                    `kotlinVersion = "2.1.0"`
                );
            } else {
                // If not found, try to add it to ext block
                const extBlockPattern = /ext\s*{/;
                if (extBlockPattern.test(config.modResults.contents)) {
                    config.modResults.contents = config.modResults.contents.replace(
                        extBlockPattern,
                        `ext {\n        kotlinVersion = "2.1.0"`
                    );
                }
            }

            // Also try to update the classpath dependency if it's hardcoded
            const classpathPattern = /classpath\s*\(['"]org.jetbrains.kotlin:kotlin-gradle-plugin:.*['"]\)/;
            if (classpathPattern.test(config.modResults.contents)) {
                config.modResults.contents = config.modResults.contents.replace(
                    classpathPattern,
                    `classpath('org.jetbrains.kotlin:kotlin-gradle-plugin:2.1.0')`
                );
            }
        }
        return config;
    });
};
