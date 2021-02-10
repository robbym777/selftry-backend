const sonarqubeScanner = require('sonarqube-scanner');
sonarqubeScanner({
    serverUrl: 'http://localhost:9000',
    options: {
        'sonar.sources': 'src',
        'sonar.inclusions': 'src/**',
        'sonar.exclusions': 'src/__tests__/**'
    }
}, () => { });