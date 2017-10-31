class MessagesController < ApplicationController

  def new
    @message = Message.new
  end
  
  def create
    @message = Message.new message_params
    if @message.valid?
      flash[:success] = "Your message has been sent!"
      # can't use deliver_later because Message instances aren't persistent
      MessageMailer.contact_me(@message).deliver_now
      redirect_to '/about'
    else
      flash[:danger] = "Oops, something went wrong..."
      render :new, :status => :reset_content
    end
  end

  private
    def message_params
      params.require(:message).permit(:name, :email, :body)
    end

end