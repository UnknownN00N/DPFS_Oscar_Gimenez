const userController = {
    login : (req, res) => {
        return res.render('users/login');
    },
    register : (req, res) =>{
        return res.render('users/register');
    },
   
};

module.exports = userController;