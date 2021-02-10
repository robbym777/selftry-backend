const logEvent = require('../events/myEmitter');
const sequelize = require('../../config/dbConn')

class CommentService {
    constructor(content, comment) {
        this.content = content
        this.comment = comment
    }

    async postComment(body, post) {
        let result;
        const trx = await sequelize.transaction()
        try {
            let content = await this.content.findByPk(post, {
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                include: [{
                    model: this.comment,
                    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
                }]
            })
            let comment = await this.comment.create(body, { transaction: trx })
            content.setComments(comment)
            trx.commit()
            result = "done"
        } catch (e) {
            logEvent.emit('APP-ERROR', {
                logTitle: '(SERVICE)-POST-COMMENT-FAILED',
                logMessage: console.log(e)
            });
            throw new Error(e);
        }
        return result;
    }
}
module.exports = CommentService