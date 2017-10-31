# Message class doesn't inherit from ApplicationRecord because the messages
# won't be saved in the database
# but: you lose the ability to use the create() method to instanciate objects

class Message
    # ActiveModel::Model needed to support instanciation of new objects using Message.create()
    include ActiveModel::Model
    # attr_accessor creates a getter and a setter method for attributes
    attr_accessor :name, :email, :body
    validates :name, :email, :body, presence: true
end