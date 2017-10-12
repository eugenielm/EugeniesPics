class CatDescription < ApplicationRecord
  belongs_to :language
  validates :language, presence: true

  belongs_to :category
  # another CatDescription instance can't have the same category
  validates :category, presence: true, uniqueness: true

  validates :content, presence: true, length: { minimum: 2, maximum: 1000 }
end
