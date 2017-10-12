class Presentation < ApplicationRecord
  belongs_to :language
  # another Presentation instance can't have the same language
  validates :language, presence: true, uniqueness: true

  validates :content, presence: true, length: { minimum: 10, maximum: 1000 }
end
