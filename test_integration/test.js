const request = require('superagent');

request
  .post('https://www.riverla.org/forms/volunteer_signups')
  .field('authenticity_token', 'ujtb7eSAzNCwgayjaHQYHnlFRkayjLmg9NzHEKkoyaw=')
  .field('page_id', '1864')
  .field('return_to', 'https://www.riverla.org/volunteer')
  .field('email_address', '')
  .field('volunteer_signup[volunteer_type_ids][]', '')
  .field('volunteer_signup[first_name]', 'Test')
  .field('volunteer_signup[last_name]', 'Member')
  .field('volunteer_signup[email]', 'ctcusc+1@gmail.com')
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
    console.log(res.status);
  })
  .catch(err => {
    console.log('Error: ' + err.status + ' ' + err.message);
  });
