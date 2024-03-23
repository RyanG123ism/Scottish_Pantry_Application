//importing contact instance
const Contact = require('../models/contactModel');


//returns a list of all contact forms that have been submitted
exports.view_all_contact_forms = async(req, res) => {
    try {        
        const contactForms = await Contact.getAllContactForms();
        console.log('Contact forms returns:' , contactForms);
        //Render the data
        res.render('contactForms', {
            'title': 'Contact Requests',
            'contactForms' : contactForms
        })
        //res.json({ contactForms });
    } catch (error) {
        console.error('Error processing GET request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Handle form submission for contact forms
exports.submit_contact_form = async (req, res) => {
    const { name, email, phone, question } = req.body;//getting data from request
    
    //creates a new contact object
    const newContact = {name,email,phone, question};

    //adds new contact form to DB 
    Contact.addContactForm(newContact, (err, contact) => {
        if (err) {
            console.error('Error saving contact form:', err);
            res.redirect('/contact?error=true');
        } else {
            console.log('Contact form submitted:' , newContact);

            //redirect back to home page
            res.redirect('/home');
        }
    });
};

//deletes a contact form based on the Id passed in 
exports.delete_contact_form = async(req, res) => {
    try {   
        //delete form     
        const contactFormId = req.body._id;
        Contact.deleteContactForm(contactFormId);

        //redirect to view_all_contact_forms
        res.redirect('/contact/view_all_contact_forms');      

    } catch (error) {
        console.error('Error deleting Contact Form:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}