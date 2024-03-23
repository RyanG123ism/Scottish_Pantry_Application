
//landing page for home controller - will return the application home page
exports.landing_page = async(req, res) => {
    res.render('home');          
}

// Returns home page
exports.home = async (req, res) => {
    // Check if user is logged in
    if (req.session.user) {
        // If user is logged in, retrieve user data from session
        const user = req.session.user;
        const userRole = user.role;

        if(userRole == "admin")
        {
            // Render the view with admin access
            res.render('home', { user: user, admin: userRole });
        }
        else if(userRole == "manager")
        {
            // Render the view with manager access
            res.render('home', { user: user, manager: userRole });
        }
        else{
            // Render the view with regular member access
            res.render('home', { user: user });
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
