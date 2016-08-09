/*
* @Author: Mike Reich
* @Date:   2016-03-16 12:00:37
* @Last Modified 2016-08-09
*/
/**
 * # Installation
 *
 *      npm install nxus-contact-form --save
 *
 * # API
 * ---
 */

'use strict';

import nodemailer from 'nodemailer'

const defaultConfig = {
  email: "",
  password: "",
  host: "",
  to: ""
}

export default class ContactForm {
  constructor(app) {
    app.get('contact-form').use(this)

    app.writeDefaultConfig('contactForm', defaultConfig)
    this.config = app.config.contactForm

    app.get('router').route('post', '/contact', (req, res) => {
      let opts = {
        to: this.config.to,
        replyTo: req.body.name+" <"+req.body.email+">",
        subject: req.body.subject,
        text: req.body.message,
      }

      var transporter = nodemailer.createTransport('smtps://'+this.config.email+":"+this.config.password+"@"+this.config.host);

      transporter.sendMail(opts, function(error, info){
        if(error){
            console.log(opts, error)
            if(req.param('redirect')) {
              req.flash("error", "Error sending contact.  Please email us at custom@govtraq.com")
              return res.redirect(req.get('Referrer'))
            } else
            return res.status(500).send(error)
        }
        if(req.param('redirect'))
          return res.redirect(req.param('redirect'))
        return res.status(200).send()
      });
    })
  }
}