class PicDescription < ApplicationRecord
  belongs_to :language
  validates :language, presence: true

  belongs_to :picture
  validates :picture, presence: true

  validates :content, presence: true, length: { minimum: 2, maximum: 500 }
end
