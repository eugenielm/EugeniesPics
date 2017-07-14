class Picture < ApplicationRecord
  # active record associations: http://guides.rubyonrails.org/association_basics.html
  # validation doc: http://guides.rubyonrails.org/active_record_validations.html
  belongs_to :category
  validates :category, presence: true
  validates :title, presence: true, length: { minimum: 1, maximum: 30 }
  validates :author, presence: true, length: { minimum: 2, maximum: 30 }
  validates :description, presence: true, length: { minimum: 4, maximum: 500 }
end
