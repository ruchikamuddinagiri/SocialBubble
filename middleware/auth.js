const auth = async (req, res, next) => {
    try{
        if(req.user){
            next()
        }
        else{
            res.status(401).redirect('/login')
        }
        
    } catch(error){
        res.status(401).redirect('/login')
    }
}

module.exports = auth