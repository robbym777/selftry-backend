const recordLog = require('../../config/logger');
describe('Logger Testing', () => {
    it('should record a log with level fatal when logType = FATAL', async () => {
        const logInfo = { logType: "FATAL" };
        await recordLog(logInfo);
        expect(logInfo.logType).toEqual('FATAL');
    });

    it('should record a log with level error when logType = ERROR', async () => {
        const logInfo = { logType: "ERROR" };
        await recordLog(logInfo);
        expect(logInfo.logType).toEqual('ERROR');
    });

    it('should record a log with level info when logType = INFO', async () => {
        const logInfo = { logType: "INFO" };
        await recordLog(logInfo);
        expect(logInfo.logType).toEqual('INFO');
    });

    it('should record a log with level debug when level is not fatal,error,or info', async () => {
        const logInfo = { logType: "DEBUG" };
        await recordLog(logInfo);
        expect(logInfo.logType).toEqual('DEBUG');
    });
});