const request = require('superagent');
const colors = require('colors/safe');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter an email the volunteer signup confirmation can be sent to: ', email => {
  request
    .post('https://www.riverla.org/forms/volunteer_signups')
    .field('authenticity_token', 'ujtb7eSAzNCwgayjaHQYHnlFRkayjLmg9NzHEKkoyaw=')
    .field('page_id', '1864')
    .field('return_to', 'https://www.riverla.org/volunteer')
    .field('email_address', '')
    .field('volunteer_signup[volunteer_type_ids][]', '')
    .field('volunteer_signup[first_name]', 'Test')
    .field('volunteer_signup[last_name]', 'Volunteer')
    .field('volunteer_signup[email]', email)
    .field('volunteer_signup[mobile_number]', '')
    .field('volunteer_signup[phone_number]', '2130001919')
    .field('volunteer_signup[phone_time]', 'Morning')
    .field('volunteer_signup[submitted_address]', '1234 St City, State 90001')
    .field('volunteer_signup[availability]', '')
    .field('volunteer_signup[content]', '')
    .field('volunteer_signup[is_private]', '0')
    .field('volunteer_signup[is_private]', '1')
    .field('commit', 'Save volunteer info')
    .field('volunteer_signup[email_opt_in]', '0')
    .field('volunteer_signup[email_opt_in]', '1')
    .field('volunteer_signup[mobile_opt_in]', '0')
    .field('volunteer_signup[mobile_opt_in]', '1')
    .then(res => {
      console.log(
        colors.bold(`
      [Instructions to check integration test result]
      Go to ${colors.green('https://larivercorp.nationbuilder.com/admin/signups')} to
      confirm a new person was created with the name ${colors.magenta('Test Volunteer')} and email ${colors.blue(
          email,
        )}.
      Then check ${colors.blue(email)}'s inbox for a confirmation email from NationBuilder.
      `),
      );
    })
    .catch(err => {
      console.log('Error: ' + err.status + ' ' + err.message);
    });
  rl.close();
});
