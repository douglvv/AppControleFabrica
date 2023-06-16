function verificaSessao(req, res, next) {
    const userId = req.session.userid
    if (!userId) {
        res.redirect(303,'/login')
    }
    else(
        next()
    )
}

module.exports = verificaSessao