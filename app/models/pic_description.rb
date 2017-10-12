class PicDescription < ApplicationRecord
  belongs_to :language
  validates :language, presence: true

  belongs_to :picture
  # another PicDescription instance can't have the same picture
  validates :picture, presence: true, uniqueness: true

  validates :content, presence: true, length: { minimum: 2, maximum: 500 }
end
