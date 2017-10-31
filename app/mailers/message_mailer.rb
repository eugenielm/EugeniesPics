class MessageMailer < ActionMailer::Base
  default from: 'eugeniespics@gmail.com'
    
  def contact_me(message)
    @body = message.body
    @name = message.name
    @email = message.email
    mail(to: "eugeniespics@gmail.com", 
         from: @email, 
         subject: "Message from 'Eugenie's pics' website")
  end
    
end