
//landing page for home controller - will return the application home page
exports.landing_page = async(req, res) => {
     //check if user is logged in
     if (req.session.user) {
        const user = req.session.user;
        const userRole = user.role;

        if(userRole == "admin")
        {
            //render the view with admin access
            res.render('home', { user: user, admin: userRole });
        }
        else if(userRole == "manager")
        {
            //render the view with manager access
            res.render('home', { user: user, manager: userRole });
        }
        else{
            //render the view with regular member access
            res.render('home', { user: user, member: userRole });
        }      
    } else {
        //if user is not logged in, render the view without user data
        res.render('home');
    }         
}

//returns home page
exports.home = async (req, res) => {
    //check if user is logged in
    if (req.session.user) {
        const user = req.session.user;
        const userRole = user.role;

        if(userRole == "admin")
        {
            //render the view with admin access
            res.render('home', { user: user, admin: userRole });
        }
        else if(userRole == "manager")
        {
            //render the view with manager access
            res.render('home', { user: user, manager: userRole });
        }
        else{
            //render the view with regular member access
            res.render('home', { user: user, member: userRole });
        }      
    } else {
        // If user is not logged in, render the view without user data
        res.render('home');
    }  
};

//returns the about page
exports.about_page = async(req, res) => {
    res.render('about');
}

//returns the contact page
exports.contact_page = async(req, res) => {
    res.render('contact');
}
