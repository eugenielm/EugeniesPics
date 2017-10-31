# Preview all emails at http://localhost:3001/rails/mailers
class MessageMailerPreview < ActionMailer::Preview
  
  def contact_me
    # Preview this email at http://localhost:3001/rails/mailers/message_mailer/contact_me
    message = Message.new name: 'toto',
                          email: 'toto@example.com',
                          body: 'Body of the email.'
    MessageMailer.contact_me(message)
  end

end