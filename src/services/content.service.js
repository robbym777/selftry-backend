const logEvent = require('../events/myEmitter');

class ContentService {
    constructor(content, comment, like) {
        this.content = content
        this.comment = comment
        this.like = like
    }
    contentInclude = () => {
        return [
            {
                model: this.comment,
                order: [['createdAt', 'DESC']],
                attributes: { exclude: ['updatedAt', 'deletedAt'] },
            },
            {
                model: this.like,
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
            },
        ]
    }

    async getByID(id) {
        let result
        try {
            result = await this.content.findByPk(id, {
                attributes: { exclude: ['updatedAt', 'deletedAt'] },
                order: [['createdAt', 'DESC']],
                include: this.contentInclude()
            })
        } catch (e) {
            logEvent.emit('APP-ERROR', {
                logTitle: '(SERVICE)-GET-BY-ID-CONTENT-FAILED',
                logMessage: console.log(e)
            })
            throw new Error(e)
        }
        return result
    }
}
module.exports = ContentService