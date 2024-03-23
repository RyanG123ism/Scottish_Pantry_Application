


//landing page for home controller - will return the application home page
exports.landing_page = async(req, res) => {
    res.render('home', {
        'title' : 'Scottish Pantry Orginisation', 
        'user' : 'user'
    });
}

//returns the about page
exports.about_page = async(req, res) => {
    res.render('about');
}

//returns the contact page
exports.contact_page = async(req, res) => {
    res.render('contact');
}
