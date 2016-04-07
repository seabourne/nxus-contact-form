/*
* @Author: Mike Reich
* @Date:   2016-03-16 12:00:37
* @Last Modified 2016-04-07
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
            console.log(opts)
            return res.status(500).send(error)
        }
        return res.status(200).send()
      });
    })
  }
}