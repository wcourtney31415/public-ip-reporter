const nodemailer = require('nodemailer');
const publicIp = require('public-ip');

async function go() {
  const ipv4 = await getIpv4();
  const ipv6 = await getIpv6();
  const message = generateMessage(ipv4, ipv6);
  const mailOptions = optionsWith(message);
  sendEmail(mailOptions);
}

async function getIpv4() {
  const ipv4 = await publicIp.v4();
  return ipv4;
}

async function getIpv6() {
  const ipv6 = await publicIp.v6();
  return ipv6;
}

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

function generateMessage(ipv4, ipv6) {
  const v4Text = `IPv4:\n${ipv4}`;
  const v6Text = `IPv6:\n${ipv6}`;
  const timeText = `As of:\n${now()}`;
  const vSpace = '\n\n'
  const message = v4Text + vSpace + v6Text + vSpace + timeText;
  return message;
}

go();