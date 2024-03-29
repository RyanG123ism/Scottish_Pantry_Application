//importing contact instance
const Contact = require('../models/contactModel');


//returns a list of all contact forms that have been submitted
exports.view_all_contact_forms = async(req, res) => {
    try {        
        const contactForms = await Contact.getAllContactForms();
        //filtering out all answered contact forms
        const filteredContactForms = contactForms.filter(contactForm => contactForm.contacted === false);

        //Render the data
        res.render('manager/contactForms', {contactForms : filteredContactForms})
    } catch (error) {
        console.error('Error processing GET request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

//post method - submits contact form 
exports.submit_contact_form = async (req, res) => {

    const { name, contactEmail, phone, question } = req.body;//getting data from request 
    const contact = {name,contactEmail,phone, question, contacted: false};
    const newContact = await Contact.addContactForm(contact);

    console.log("newContact", newContact);
    if(!newContact)
    {
        let errorMessage = "Sorry, we had an issue submitting your form - please try again";
        res.render('contact', {errorMessage: errorMessage});
    }
    else{
        //redirect back to home page        
        res.redirect('/home');
    }
};

//updates contact form - contacted property from false to true
exports.update_contact_form = async(req, res) => {
    try {   
        //delete form     
        const contactFormId = req.body._id;
        await Contact.updateContactForm(contactFormId);

        //redirect to view_all_contact_forms
        res.redirect('/contact/view_all_contact_forms');      

    } catch (error) {
        console.error('Error updating Contact Form:', error);
        let errorMessage = "Sorry, we had an issue submitting your form - please try again";
        res.render('manager/contactForms', {errorMessage: errorMessage});
    }
}

//deletes a contact form based on the Id passed in - NOT IN USE
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