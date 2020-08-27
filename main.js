'use strict';
const nodemailer = require('nodemailer');
const getIP = require('external-ip')();

function constructEmail(ipv4) {
  const message = generateMessage(ipv4);
  const mailOptions = optionsWith(message);
  sendEmail(mailOptions);
}

getIP((err, ip) => {
  if (err) {
    var ipv4 = "Failed to retrieve IpV4.";
    throw err;
  }
  ipv4 = ip;
  constructEmail(ipv4);
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER,
    pass: process.env.PASS
  }
});

function optionsWith(text) {
  const options = {
    from: '',
    to: process.env.TO,
    subject: "IP Report",
    text: text
  };
  return options;
};

function sendEmail(mailOptions) {
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log(info.response);
    }
  });
}

function now() {
  const time = new Date();
  const date = ("0" + time.getDate()).slice(-2);
  const month = ("0" + (time.getMonth() + 1)).slice(-2);
  const year = time.getFullYear();
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const wholeDate = month + "-" + date + "-" + year;
  const wholeTime = hours + ":" + minutes + ":" + seconds;
  return (wholeDate + " " + wholeTime);
}

function generateMessage(ipv4) {
  const v4Text = `IPv4:\n${ipv4}`;
  const timeText = `As of:\n${now()}`;
  const vSpace = '\n\n'
  const message = v4Text + vSpace + timeText;
  return message;
}