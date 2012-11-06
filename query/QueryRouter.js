var QueryRouter = function() {

};

QueryRouter.prototype.route = function(req, res) {
    res.send('QueryRouter');
}

module.exports = new QueryRouter();